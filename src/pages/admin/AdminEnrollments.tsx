import { useState } from "react";
import {
  Search,
  MoreVertical,
  Trash2,
  Eye,
  Loader2,
  Check,
  X,
  ExternalLink,
  Image,
  Filter,
  FileText,
  CreditCard,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useAdminEnrollments,
  useDeleteEnrollment,
  useUpdateEnrollmentStatus,
} from "@/hooks/useAdminData";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">Confirmed</Badge>;
  if (status === "rejected") return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100">Rejected</Badge>;
  return <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400">Pending</Badge>;
}

function PaymentMethodIcon({ method }: { method: string | null }) {
  switch (method) {
    case "stripe":
      return <CreditCard className="w-4 h-4 text-purple-500" />;
    case "paystack":
      return <CreditCard className="w-4 h-4 text-blue-500" />;
    case "bank_transfer":
      return <Building2 className="w-4 h-4 text-green-500" />;
    default:
      return <FileText className="w-4 h-4 text-muted-foreground" />;
  }
}

function ReceiptThumbnail({ url, onClick }: { url: string; onClick: () => void }) {
  const isPdf = url?.toLowerCase().endsWith(".pdf");
  
  if (isPdf) {
    return (
      <button
        onClick={onClick}
        className="relative group w-12 h-12 rounded-lg overflow-hidden border border-border hover:border-primary transition-colors bg-muted flex items-center justify-center"
      >
        <FileText className="w-5 h-5 text-muted-foreground" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-4 h-4 text-white" />
        </div>
      </button>
    );
  }
  
  return (
    <button
      onClick={onClick}
      className="relative group w-12 h-12 rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
    >
      <img
        src={url}
        alt="Receipt"
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Eye className="w-4 h-4 text-white" />
      </div>
    </button>
  );
}

export default function AdminEnrollments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [deletingEnrollment, setDeletingEnrollment] = useState<any>(null);
  const [viewingEnrollment, setViewingEnrollment] = useState<any>(null);
  const [rejectingEnrollment, setRejectingEnrollment] = useState<any>(null);
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: enrollments, isLoading } = useAdminEnrollments();
  const deleteEnrollment = useDeleteEnrollment();
  const updateStatus = useUpdateEnrollmentStatus();
  const { user } = useAuth();

  const filteredEnrollments = enrollments?.filter((enrollment: any) => {
    const matchesSearch =
      enrollment.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.course?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter;
    
    const matchesPayment = 
      paymentFilter === "all" ||
      (paymentFilter === "with_receipt" && enrollment.receipt_url) ||
      (paymentFilter === "no_receipt" && !enrollment.receipt_url) ||
      enrollment.payment_method === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Count by status for tabs
  const statusCounts = enrollments?.reduce((acc: Record<string, number>, e: any) => {
    acc[e.status] = (acc[e.status] || 0) + 1;
    return acc;
  }, {}) || {};

  const handleDelete = async () => {
    if (deletingEnrollment) {
      await deleteEnrollment.mutateAsync(deletingEnrollment.id);
      setDeletingEnrollment(null);
    }
  };

  const handleApprove = async (enrollment: any) => {
    await updateStatus.mutateAsync({
      id: enrollment.id,
      status: "confirmed",
      approved_by: user?.id ?? null,
      userEmail: enrollment.profile?.email || enrollment.user_email,
      userName: enrollment.profile?.display_name || "Learner",
      courseName: enrollment.course?.title,
      cohortName: enrollment.cohort?.title,
    });
    if (viewingEnrollment?.id === enrollment.id) {
      setViewingEnrollment(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingEnrollment) return;
    await updateStatus.mutateAsync({
      id: rejectingEnrollment.id,
      status: "rejected",
      rejection_reason: rejectionReason || null,
      userEmail: rejectingEnrollment.profile?.email || rejectingEnrollment.user_email,
      userName: rejectingEnrollment.profile?.display_name || "Learner",
      courseName: rejectingEnrollment.course?.title,
      cohortName: rejectingEnrollment.cohort?.title,
    });
    setRejectingEnrollment(null);
    setRejectionReason("");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Enrollments</h1>
          <p className="text-muted-foreground">Manage course enrollments and payment approvals</p>
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all" className="gap-2">
              All
              <Badge variant="secondary" className="ml-1 text-xs">{enrollments?.length || 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              Pending
              <Badge variant="secondary" className="ml-1 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {statusCounts.pending || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="gap-2">
              Confirmed
              <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {statusCounts.confirmed || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              Rejected
              <Badge variant="secondary" className="ml-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {statusCounts.rejected || 0}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Payment filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="with_receipt">With Receipt</SelectItem>
              <SelectItem value="no_receipt">No Receipt</SelectItem>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="paystack">Paystack</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-10 rounded-lg" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredEnrollments?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No enrollments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEnrollments?.map((enrollment: any) => (
                    <motion.tr
                      key={enrollment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={enrollment.profile?.avatar_url || ""} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {enrollment.profile?.display_name?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {enrollment.profile?.display_name || "Unknown User"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {enrollment.course?.title || "Unknown Course"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={enrollment.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <PaymentMethodIcon method={enrollment.payment_method} />
                          <div>
                            <div className="text-foreground capitalize">{enrollment.payment_method?.replace("_", " ") || "—"}</div>
                            {enrollment.payment_amount != null && (
                              <div className="text-muted-foreground text-xs">
                                {enrollment.payment_currency} {enrollment.payment_amount}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {enrollment.receipt_url ? (
                          <ReceiptThumbnail
                            url={enrollment.receipt_url}
                            onClick={() => setViewingReceipt(enrollment.receipt_url)}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg border border-dashed border-border flex items-center justify-center">
                            <Image className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Progress value={enrollment.progress_percentage || 0} className="h-2 w-20" />
                          <span className="text-sm text-muted-foreground">
                            {enrollment.progress_percentage || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(enrollment.enrolled_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewingEnrollment(enrollment)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View details
                            </DropdownMenuItem>
                            {enrollment.receipt_url && (
                              <DropdownMenuItem onClick={() => setViewingReceipt(enrollment.receipt_url)}>
                                <Image className="w-4 h-4 mr-2" />
                                View Receipt
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                              <Link to={`/courses/${enrollment.course?.slug}`}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Course
                              </Link>
                            </DropdownMenuItem>

                            {enrollment.status === "pending" ? (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => handleApprove(enrollment)}
                                  className="text-green-600"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => setRejectingEnrollment(enrollment)}
                                  className="text-red-600"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            ) : null}

                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => setDeletingEnrollment(enrollment)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Enrollment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {/* View Receipt Modal */}
        <Dialog open={!!viewingReceipt} onOpenChange={(open) => !open && setViewingReceipt(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Payment Receipt</DialogTitle>
              <DialogDescription>Review the uploaded payment proof</DialogDescription>
            </DialogHeader>
            {viewingReceipt && (
              <div className="relative rounded-lg overflow-hidden bg-muted">
                {viewingReceipt.toLowerCase().endsWith(".pdf") ? (
                  <div className="p-8 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">PDF Receipt</p>
                    <Button asChild>
                      <a href={viewingReceipt} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View PDF
                      </a>
                    </Button>
                  </div>
                ) : (
                  <img
                    src={viewingReceipt}
                    alt="Payment Receipt"
                    className="w-full h-auto max-h-[60vh] object-contain"
                    loading="lazy"
                  />
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingReceipt(null)}>
                Close
              </Button>
              {viewingReceipt && !viewingReceipt.toLowerCase().endsWith(".pdf") && (
                <Button asChild>
                  <a href={viewingReceipt} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Full Size
                  </a>
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Details */}
        <Dialog open={!!viewingEnrollment} onOpenChange={(open) => !open && setViewingEnrollment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enrollment Details</DialogTitle>
              <DialogDescription>Review registration submission and payment info.</DialogDescription>
            </DialogHeader>

            {viewingEnrollment ? (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">User</div>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={viewingEnrollment.profile?.avatar_url || ""} />
                        <AvatarFallback className="text-xs">
                          {viewingEnrollment.profile?.display_name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{viewingEnrollment.profile?.display_name || "Unknown"}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">Course</div>
                    <div className="font-medium">{viewingEnrollment.course?.title || "Unknown"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">Status</div>
                    <StatusBadge status={viewingEnrollment.status} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">Payment Method</div>
                    <div className="flex items-center gap-2">
                      <PaymentMethodIcon method={viewingEnrollment.payment_method} />
                      <span className="capitalize">{viewingEnrollment.payment_method?.replace("_", " ") || "—"}</span>
                    </div>
                  </div>
                  {viewingEnrollment.payment_amount != null && (
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-xs uppercase tracking-wide">Amount</div>
                      <div className="font-medium">
                        {viewingEnrollment.payment_currency} {viewingEnrollment.payment_amount}
                      </div>
                    </div>
                  )}
                  {viewingEnrollment.cohort?.title && (
                    <div className="space-y-1">
                      <div className="text-muted-foreground text-xs uppercase tracking-wide">Cohort</div>
                      <div className="font-medium">{viewingEnrollment.cohort.title}</div>
                    </div>
                  )}
                </div>

                {/* Receipt Preview */}
                {viewingEnrollment.receipt_url && (
                  <div className="space-y-2">
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">Payment Receipt</div>
                    <div className="relative rounded-lg overflow-hidden border border-border bg-muted p-2">
                      <img
                        src={viewingEnrollment.receipt_url}
                        alt="Payment Receipt"
                        className="w-full h-48 object-contain rounded"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-4 right-4"
                        onClick={() => setViewingReceipt(viewingEnrollment.receipt_url)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Full View
                      </Button>
                    </div>
                  </div>
                )}

                {/* Registration Data */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="text-sm font-medium text-foreground mb-2">Registration Submission</div>
                  <pre className="text-xs whitespace-pre-wrap text-muted-foreground font-mono">
                    {JSON.stringify(viewingEnrollment.submission?.data ?? {}, null, 2)}
                  </pre>
                </div>
              </div>
            ) : null}

            <DialogFooter>
              {viewingEnrollment?.status === "pending" ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setViewingEnrollment(null);
                      setRejectingEnrollment(viewingEnrollment);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApprove(viewingEnrollment)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Enrollment
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setViewingEnrollment(null)}>Close</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={!!rejectingEnrollment} onOpenChange={(open) => !open && setRejectingEnrollment(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Enrollment</DialogTitle>
              <DialogDescription>
                This will notify the user their enrollment was rejected. You can optionally provide a reason.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg text-sm">
                <span className="text-muted-foreground">Rejecting enrollment for: </span>
                <span className="font-medium">{rejectingEnrollment?.profile?.display_name}</span>
                <span className="text-muted-foreground"> in </span>
                <span className="font-medium">{rejectingEnrollment?.course?.title}</span>
              </div>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection (optional, visible to admins)"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectingEnrollment(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={updateStatus.isPending}
              >
                {updateStatus.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Reject Enrollment
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingEnrollment} onOpenChange={(open) => !open && setDeletingEnrollment(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Enrollment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this enrollment? The user will lose access to the course.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteEnrollment.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

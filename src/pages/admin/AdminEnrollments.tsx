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
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useAdminEnrollments,
  useDeleteEnrollment,
  useUpdateEnrollmentStatus,
} from "@/hooks/useAdminData";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>;
  if (status === "rejected") return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
  return <Badge variant="outline">Pending</Badge>;
}

export default function AdminEnrollments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingEnrollment, setDeletingEnrollment] = useState<any>(null);
  const [viewingEnrollment, setViewingEnrollment] = useState<any>(null);
  const [rejectingEnrollment, setRejectingEnrollment] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: enrollments, isLoading } = useAdminEnrollments();
  const deleteEnrollment = useDeleteEnrollment();
  const updateStatus = useUpdateEnrollmentStatus();
  const { user } = useAuth();

  const filteredEnrollments = enrollments?.filter((enrollment: any) => {
    const matchesSearch =
      enrollment.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.course?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
    });
  };

  const handleReject = async () => {
    if (!rejectingEnrollment) return;
    await updateStatus.mutateAsync({
      id: rejectingEnrollment.id,
      status: "rejected",
      rejection_reason: rejectionReason || null,
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
          <p className="text-muted-foreground">Manage course enrollments</p>
        </div>

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
                <TableHead>Progress</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
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
                  <TableRow key={enrollment.id}>
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
                      <div className="text-sm">
                        <div className="text-foreground capitalize">{enrollment.payment_method || "—"}</div>
                        <div className="text-muted-foreground">
                          {enrollment.payment_amount != null ? `$${enrollment.payment_amount}` : ""}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={enrollment.progress_percentage || 0} className="h-2 w-20" />
                        <span className="text-sm text-muted-foreground">
                          {enrollment.progress_percentage || 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(enrollment.enrolled_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {enrollment.completed_at ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline">In Progress</Badge>
                      )}
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
                          <DropdownMenuItem asChild>
                            <Link to={`/courses/${enrollment.course?.slug}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Course
                            </Link>
                          </DropdownMenuItem>

                          {enrollment.status === "pending" ? (
                            <>
                              <DropdownMenuItem onClick={() => handleApprove(enrollment)}>
                                <Check className="w-4 h-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setRejectingEnrollment(enrollment)}>
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* View Details */}
        <Dialog open={!!viewingEnrollment} onOpenChange={(open) => !open && setViewingEnrollment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enrollment details</DialogTitle>
              <DialogDescription>Review registration submission and payment info.</DialogDescription>
            </DialogHeader>

            {viewingEnrollment ? (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">User</div>
                    <div className="text-foreground font-medium">{viewingEnrollment.profile?.display_name || "Unknown"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Course</div>
                    <div className="text-foreground font-medium">{viewingEnrollment.course?.title || "Unknown"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <div className="mt-1"><StatusBadge status={viewingEnrollment.status} /></div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Payment</div>
                    <div className="text-foreground font-medium capitalize">{viewingEnrollment.payment_method || "—"}</div>
                  </div>
                  {viewingEnrollment.cohort?.title ? (
                    <div>
                      <div className="text-muted-foreground">Cohort</div>
                      <div className="text-foreground font-medium">{viewingEnrollment.cohort.title}</div>
                    </div>
                  ) : null}
                  {viewingEnrollment.profile?.receipt_url ? (
                    <div>
                      <div className="text-muted-foreground">Bank proof</div>
                      <a
                        href={viewingEnrollment.profile.receipt_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        Open receipt
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="text-sm font-medium text-foreground mb-2">Registration submission</div>
                  <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
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
                    Reject
                  </Button>
                  <Button onClick={() => handleApprove(viewingEnrollment)}>
                    Approve
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
              <DialogTitle>Reject enrollment</DialogTitle>
              <DialogDescription>Optionally include a short reason (visible to admins).</DialogDescription>
            </DialogHeader>

            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason (optional)"
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectingEnrollment(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={updateStatus.isPending}
              >
                {updateStatus.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Reject"
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

import { useState } from "react";
import {
  Search,
  MoreVertical,
  Trash2,
  Eye,
  Loader2,
  Copy,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useAdminCertificates, useDeleteCertificate,
  useAdminCertificatePayments, useUpdateCertificatePaymentStatus,
} from "@/hooks/useAdminData";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminCertificates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingCertificate, setDeletingCertificate] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: certificates, isLoading } = useAdminCertificates();
  const deleteCertificate = useDeleteCertificate();
  const { data: payments, isLoading: paymentsLoading } = useAdminCertificatePayments();
  const updatePaymentStatus = useUpdateCertificatePaymentStatus();

  const filteredCertificates = certificates?.filter((cert: any) =>
    cert.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cert.verification_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayments = payments?.filter((p: any) =>
    p.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.course?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (deletingCertificate) {
      await deleteCertificate.mutateAsync(deletingCertificate.id);
      setDeletingCertificate(null);
    }
  };

  const copyVerificationCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Verification code copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-600">Completed</Badge>;
      case "pending": return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
      case "failed": return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Certificates & Payments</h1>
          <p className="text-muted-foreground">Manage certificates and certificate payment approvals</p>
        </div>

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

        <Tabs defaultValue="payments" className="w-full">
          <TabsList>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Certificate Payments
              {payments?.filter((p: any) => p.payment_status === "pending").length ? (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                  {payments.filter((p: any) => p.payment_status === "pending").length}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="certificates">Issued Certificates</TabsTrigger>
          </TabsList>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsLoading ? (
                    [...Array(4)].map((_, i) => (
                      <TableRow key={i}>
                        {[...Array(7)].map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredPayments?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No certificate payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments?.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={payment.profile?.avatar_url || ""} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {payment.profile?.display_name?.[0]?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">
                              {payment.profile?.display_name || "Unknown"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm">
                          {payment.course?.title || "Unknown"}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {payment.currency} {payment.amount?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {payment.receipt_url ? (
                            <a
                              href={payment.receipt_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              View Receipt
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-sm">No receipt</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(payment.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={payment.payment_status}
                            onValueChange={(value) =>
                              updatePaymentStatus.mutate({ id: payment.id, payment_status: value })
                            }
                          >
                            <SelectTrigger className="w-[130px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Verification Code</TableHead>
                    <TableHead>Issued</TableHead>
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
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredCertificates?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No certificates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCertificates?.map((cert: any) => (
                      <TableRow key={cert.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={cert.profile?.avatar_url || ""} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {cert.profile?.display_name?.[0]?.toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {cert.profile?.display_name || "Unknown User"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {cert.course?.title || "Unknown Course"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                              {cert.verification_code}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => copyVerificationCode(cert.verification_code, cert.id)}
                            >
                              {copiedId === cert.id ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(cert.issued_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/courses/${cert.course?.slug}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Course
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeletingCertificate(cert)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Revoke Certificate
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
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingCertificate} onOpenChange={(open) => !open && setDeletingCertificate(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke Certificate</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to revoke this certificate? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                {deleteCertificate.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Revoke
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

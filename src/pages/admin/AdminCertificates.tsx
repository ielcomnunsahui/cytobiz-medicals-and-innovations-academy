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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminCertificates, useDeleteCertificate } from "@/hooks/useAdminData";
import { useAllCertificatePayments } from "@/hooks/useCourseAccess";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminCertificates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingCertificate, setDeletingCertificate] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: certificates, isLoading } = useAdminCertificates();
  const { data: payments, isLoading: paymentsLoading } = useAllCertificatePayments();
  const deleteCertificate = useDeleteCertificate();

  const filteredCertificates = certificates?.filter((cert: any) => {
    return cert.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.verification_code?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredPayments = payments?.filter((p: any) => {
    return p.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.course?.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Certificates & Payments</h1>
          <p className="text-muted-foreground">Manage issued certificates and certificate payments</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </div>

        <Tabs defaultValue="certificates">
          <TabsList>
            <TabsTrigger value="certificates">Certificates ({certificates?.length || 0})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments?.length || 0})</TabsTrigger>
          </TabsList>

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
                        {[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>)}
                      </TableRow>
                    ))
                  ) : filteredCertificates?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No certificates found</TableCell>
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
                            <span className="font-medium">{cert.profile?.display_name || "Unknown User"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{cert.course?.title || "Unknown Course"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono">{cert.verification_code}</code>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyVerificationCode(cert.verification_code, cert.id)}>
                              {copiedId === cert.id ? <CheckCircle className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(cert.issued_at), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/courses/${cert.course?.slug}`}><Eye className="w-4 h-4 mr-2" />View Course</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => setDeletingCertificate(cert)}>
                                <Trash2 className="w-4 h-4 mr-2" />Revoke Certificate
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

          <TabsContent value="payments">
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentsLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        {[...Array(7)].map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>)}
                      </TableRow>
                    ))
                  ) : filteredPayments?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No payments found</TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments?.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <span className="font-medium">{payment.profile?.display_name || "Unknown"}</span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{payment.course?.title || "Unknown"}</TableCell>
                        <TableCell>₦{payment.amount?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {payment.payment_method?.replace("_", " ") || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={payment.payment_status === "completed" ? "default" : payment.payment_status === "pending" ? "secondary" : "destructive"}>
                            {payment.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(payment.created_at), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          {payment.receipt_url ? (
                            <a href={payment.receipt_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                              View
                            </a>
                          ) : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <AlertDialog open={!!deletingCertificate} onOpenChange={(open) => !open && setDeletingCertificate(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke Certificate</AlertDialogTitle>
              <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                {deleteCertificate.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Revoke
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

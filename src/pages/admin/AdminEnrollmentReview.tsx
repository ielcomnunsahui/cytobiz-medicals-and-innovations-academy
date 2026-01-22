import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Check, 
  X, 
  Eye, 
  Clock, 
  User, 
  CreditCard, 
  FileText, 
  Calendar,
  ExternalLink,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

type EnrollmentStatus = "pending" | "confirmed" | "rejected";

interface EnrollmentWithDetails {
  id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  payment_method: string | null;
  payment_amount: number | null;
  receipt_url: string | null;
  rejection_reason: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  user_id: string;
  course: {
    id: string;
    title: string;
    slug: string;
    price: number | null;
  };
  cohort: {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
  } | null;
  profile: {
    display_name: string | null;
    phone: string | null;
  } | null;
  registration_submission: {
    data: Record<string, any>;
  } | null;
}

export default function AdminEnrollmentReview() {
  const queryClient = useQueryClient();
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentWithDetails | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["admin-enrollments-review"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          id,
          status,
          enrolled_at,
          payment_method,
          payment_amount,
          receipt_url,
          rejection_reason,
          approved_at,
          rejected_at,
          user_id,
          course:courses(id, title, slug, price),
          cohort:cohorts(id, title, start_date, end_date),
          registration_submission:registration_submissions(data)
        `)
        .order("enrolled_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set((data || []).map((e) => e.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, phone")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]));

      return (data || []).map((enrollment) => ({
        ...enrollment,
        profile: profileMap.get(enrollment.user_id) || null,
      })) as EnrollmentWithDetails[];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (enrollmentId: string) => {
      const { error } = await supabase
        .from("enrollments")
        .update({
          status: "confirmed",
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", enrollmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments-review"] });
      toast.success("Enrollment approved successfully");
      setSelectedEnrollment(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve enrollment");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ enrollmentId, reason }: { enrollmentId: string; reason: string }) => {
      const { error } = await supabase
        .from("enrollments")
        .update({
          status: "rejected",
          rejected_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq("id", enrollmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enrollments-review"] });
      toast.success("Enrollment rejected");
      setSelectedEnrollment(null);
      setRejectDialogOpen(false);
      setRejectionReason("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject enrollment");
    },
  });

  const pendingEnrollments = enrollments?.filter((e) => e.status === "pending") || [];
  const confirmedEnrollments = enrollments?.filter((e) => e.status === "confirmed") || [];
  const rejectedEnrollments = enrollments?.filter((e) => e.status === "rejected") || [];

  const getStatusBadge = (status: EnrollmentStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
    }
  };

  const EnrollmentCard = ({ enrollment }: { enrollment: EnrollmentWithDetails }) => (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setSelectedEnrollment(enrollment)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge(enrollment.status)}
              {enrollment.receipt_url && (
                <Badge variant="secondary" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  Receipt
                </Badge>
              )}
            </div>
            <h3 className="font-semibold truncate">{enrollment.course?.title}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <User className="w-3 h-3" />
              {enrollment.profile?.display_name || "Unknown User"}
            </p>
            {enrollment.cohort && (
              <p className="text-xs text-muted-foreground mt-1">
                Cohort: {enrollment.cohort.title}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-medium">
              {enrollment.payment_amount ? `₦${enrollment.payment_amount.toLocaleString()}` : "N/A"}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(enrollment.enrolled_at), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Enrollment Review</h1>
          <p className="text-muted-foreground">Review and manage pending enrollment requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingEnrollments.length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{confirmedEnrollments.length}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rejectedEnrollments.length}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="w-4 h-4" />
              Pending ({pendingEnrollments.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Confirmed ({confirmedEnrollments.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="w-4 h-4" />
              Rejected ({rejectedEnrollments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : pendingEnrollments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pending enrollments to review</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {pendingEnrollments.map((enrollment) => (
                  <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="confirmed" className="mt-4">
            {confirmedEnrollments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No confirmed enrollments yet</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {confirmedEnrollments.map((enrollment) => (
                  <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="mt-4">
            {rejectedEnrollments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No rejected enrollments</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {rejectedEnrollments.map((enrollment) => (
                  <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Detail Dialog */}
        <Dialog open={!!selectedEnrollment} onOpenChange={(open) => !open && setSelectedEnrollment(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedEnrollment && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    Enrollment Details
                    {getStatusBadge(selectedEnrollment.status)}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Course Info */}
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Course Information
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Course</p>
                        <p className="font-medium">{selectedEnrollment.course?.title}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium">₦{selectedEnrollment.course?.price?.toLocaleString() || "Free"}</p>
                      </div>
                      {selectedEnrollment.cohort && (
                        <>
                          <div>
                            <p className="text-muted-foreground">Cohort</p>
                            <p className="font-medium">{selectedEnrollment.cohort.title}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">
                              {format(new Date(selectedEnrollment.cohort.start_date), "MMM d")} - {format(new Date(selectedEnrollment.cohort.end_date), "MMM d, yyyy")}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Student Information
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedEnrollment.profile?.display_name || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedEnrollment.profile?.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Enrolled At</p>
                        <p className="font-medium">{format(new Date(selectedEnrollment.enrolled_at), "MMM d, yyyy h:mm a")}</p>
                      </div>
                    </div>

                    {/* Registration Form Data */}
                    {selectedEnrollment.registration_submission?.data && Object.keys(selectedEnrollment.registration_submission.data).length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Registration Form Responses</p>
                        <div className="grid gap-2 text-sm">
                          {Object.entries(selectedEnrollment.registration_submission.data).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Info */}
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Payment Information
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Method</p>
                        <p className="font-medium capitalize">{selectedEnrollment.payment_method?.replace("_", " ") || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">₦{selectedEnrollment.payment_amount?.toLocaleString() || "N/A"}</p>
                      </div>
                    </div>

                    {/* Receipt Preview */}
                    {selectedEnrollment.receipt_url && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Payment Receipt</p>
                        <div className="rounded-lg border overflow-hidden">
                          {selectedEnrollment.receipt_url.endsWith(".pdf") ? (
                            <div className="p-4 bg-muted/50 text-center">
                              <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground mb-2">PDF Receipt</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(selectedEnrollment.receipt_url!, "_blank")}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View PDF
                              </Button>
                            </div>
                          ) : (
                            <div className="relative">
                              <img
                                src={selectedEnrollment.receipt_url}
                                alt="Payment receipt"
                                className="w-full max-h-64 object-contain bg-muted/50 cursor-pointer"
                                onClick={() => setPreviewReceiptUrl(selectedEnrollment.receipt_url)}
                              />
                              <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => window.open(selectedEnrollment.receipt_url!, "_blank")}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rejection Reason */}
                  {selectedEnrollment.status === "rejected" && selectedEnrollment.rejection_reason && (
                    <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
                      <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Rejection Reason</h4>
                      <p className="text-sm text-red-700 dark:text-red-300">{selectedEnrollment.rejection_reason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {selectedEnrollment.status === "pending" && (
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setRejectDialogOpen(true)}
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => approveMutation.mutate(selectedEnrollment.id)}
                        disabled={approveMutation.isPending}
                        className="gap-2"
                      >
                        {approveMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Approve Enrollment
                      </Button>
                    </DialogFooter>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Enrollment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please provide a reason for rejecting this enrollment. This will be visible to the student.
              </p>
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedEnrollment && rejectMutation.mutate({ 
                  enrollmentId: selectedEnrollment.id, 
                  reason: rejectionReason 
                })}
                disabled={!rejectionReason.trim() || rejectMutation.isPending}
              >
                {rejectMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Full Receipt Preview */}
        <Dialog open={!!previewReceiptUrl} onOpenChange={() => setPreviewReceiptUrl(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Receipt Preview</DialogTitle>
            </DialogHeader>
            {previewReceiptUrl && (
              <img
                src={previewReceiptUrl}
                alt="Receipt full preview"
                className="w-full max-h-[70vh] object-contain"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
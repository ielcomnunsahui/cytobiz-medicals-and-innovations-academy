import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  CreditCard,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function StatusBadge({ status }: { status: string }) {
  if (status === "confirmed") {
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle className="w-3 h-3 mr-1" />
        Confirmed
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        <XCircle className="w-3 h-3 mr-1" />
        Rejected
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-yellow-500 text-yellow-600 dark:text-yellow-400">
      <Clock className="w-3 h-3 mr-1" />
      Pending Review
    </Badge>
  );
}

export default function MyEnrollments() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["my-enrollments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          *,
          course:courses(id, title, slug, thumbnail_url, course_type),
          cohort:cohorts(title, start_date, end_date)
        `)
        .eq("user_id", user.id)
        .order("enrolled_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const pendingEnrollments = enrollments?.filter((e) => e.status === "pending") || [];
  const confirmedEnrollments = enrollments?.filter((e) => e.status === "confirmed") || [];
  const rejectedEnrollments = enrollments?.filter((e) => e.status === "rejected") || [];

  const bankName = settings?.bank_transfer_bank_name || "";
  const accountName = settings?.bank_transfer_account_name || "";
  const accountNumber = settings?.bank_transfer_account_number || "";

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 pt-24 pb-16">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-foreground mb-2">My Enrollments</h1>
              <p className="text-muted-foreground">
                Track your course enrollments and payment status
              </p>
            </motion.div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Skeleton className="w-24 h-24 rounded-lg" />
                        <div className="flex-1 space-y-3">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : enrollments?.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No enrollments yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Browse our courses and start your learning journey today.
                  </p>
                  <Button asChild>
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {/* Pending Enrollments */}
                {pendingEnrollments.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      Pending Review ({pendingEnrollments.length})
                    </h2>
                    <div className="space-y-4">
                      {pendingEnrollments.map((enrollment, index) => (
                        <motion.div
                          key={enrollment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-yellow-200 dark:border-yellow-800/50">
                            <CardContent className="p-6">
                              <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                                  {enrollment.course?.thumbnail_url ? (
                                    <img
                                      src={enrollment.course.thumbnail_url}
                                      alt={enrollment.course.title}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <BookOpen className="w-8 h-8 text-primary/50" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-foreground">
                                      {enrollment.course?.title}
                                    </h3>
                                    <StatusBadge status={enrollment.status} />
                                  </div>
                                  
                                  <div className="text-sm text-muted-foreground mb-3">
                                    Enrolled on {format(new Date(enrollment.enrolled_at), "MMM d, yyyy")}
                                    {enrollment.cohort?.title && (
                                      <span> • Cohort: {enrollment.cohort.title}</span>
                                    )}
                                  </div>

                                  {enrollment.payment_method === "bank_transfer" && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-3">
                                      <div className="flex items-start gap-2 mb-2">
                                        <CreditCard className="w-4 h-4 text-yellow-600 mt-0.5" />
                                        <div>
                                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                            Bank Transfer Payment Instructions
                                          </p>
                                          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                            Please transfer ${enrollment.payment_amount} to:
                                          </p>
                                          <div className="mt-2 text-xs text-yellow-800 dark:text-yellow-200 space-y-1">
                                            <p><strong>Bank:</strong> {bankName || "Loading..."}</p>
                                            <p><strong>Account Name:</strong> {accountName || "Loading..."}</p>
                                            <p><strong>Account Number:</strong> {accountNumber || "Loading..."}</p>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {!enrollment.receipt_url && (
                                        <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-700">
                                          <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                                            After payment, upload your receipt to expedite approval.
                                          </p>
                                          <Button size="sm" variant="outline" asChild>
                                            <Link to={`/enroll/${enrollment.course?.slug}`}>
                                              <Upload className="w-3 h-3 mr-1" />
                                              Upload Receipt
                                            </Link>
                                          </Button>
                                        </div>
                                      )}
                                      
                                      {enrollment.receipt_url && (
                                        <div className="mt-3 pt-3 border-t border-yellow-200 dark:border-yellow-700">
                                          <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Receipt uploaded - awaiting admin review
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                      <Link to={`/courses/${enrollment.course?.slug}`}>
                                        View Course
                                        <ExternalLink className="w-3 h-3 ml-1" />
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Confirmed Enrollments */}
                {confirmedEnrollments.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Active Enrollments ({confirmedEnrollments.length})
                    </h2>
                    <div className="space-y-4">
                      {confirmedEnrollments.map((enrollment, index) => (
                        <motion.div
                          key={enrollment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card>
                            <CardContent className="p-6">
                              <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                                  {enrollment.course?.thumbnail_url ? (
                                    <img
                                      src={enrollment.course.thumbnail_url}
                                      alt={enrollment.course.title}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  ) : (
                                    <BookOpen className="w-8 h-8 text-primary/50" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-foreground">
                                      {enrollment.course?.title}
                                    </h3>
                                    <StatusBadge status={enrollment.status} />
                                  </div>
                                  
                                  <div className="text-sm text-muted-foreground mb-3">
                                    Approved on {enrollment.approved_at ? format(new Date(enrollment.approved_at), "MMM d, yyyy") : "N/A"}
                                    {enrollment.cohort?.title && (
                                      <span> • Cohort: {enrollment.cohort.title}</span>
                                    )}
                                  </div>

                                  <Button size="sm" asChild>
                                    <Link to={`/learn/${enrollment.course_id}`}>
                                      Continue Learning
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Rejected Enrollments */}
                {rejectedEnrollments.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-500" />
                      Rejected ({rejectedEnrollments.length})
                    </h2>
                    <div className="space-y-4">
                      {rejectedEnrollments.map((enrollment, index) => (
                        <motion.div
                          key={enrollment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-red-200 dark:border-red-800/50">
                            <CardContent className="p-6">
                              <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/20 dark:to-red-900/10 flex items-center justify-center shrink-0">
                                  <BookOpen className="w-8 h-8 text-red-400" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                    <h3 className="font-semibold text-foreground">
                                      {enrollment.course?.title}
                                    </h3>
                                    <StatusBadge status={enrollment.status} />
                                  </div>
                                  
                                  <div className="text-sm text-muted-foreground mb-3">
                                    Rejected on {enrollment.rejected_at ? format(new Date(enrollment.rejected_at), "MMM d, yyyy") : "N/A"}
                                  </div>

                                  {enrollment.rejection_reason && (
                                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-3">
                                      <p className="text-sm text-red-800 dark:text-red-200">
                                        <strong>Reason:</strong> {enrollment.rejection_reason}
                                      </p>
                                    </div>
                                  )}

                                  <Button variant="outline" size="sm" asChild>
                                    <Link to={`/courses/${enrollment.course?.slug}`}>
                                      View Course Details
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}

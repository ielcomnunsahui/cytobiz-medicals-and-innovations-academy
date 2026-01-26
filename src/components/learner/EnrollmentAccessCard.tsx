import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  Award,
  Lock,
  Unlock,
  ClipboardCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCourseAccessStatus } from "@/hooks/useCourseAccess";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EnrollmentAccessCardProps {
  enrollment: {
    id: string;
    course_id: string;
    cohort_id?: string | null;
    status: string;
    enrolled_at: string;
    approved_at?: string | null;
    course?: {
      id: string;
      title: string;
      slug: string;
      thumbnail_url?: string | null;
      course_type: string;
    } | null;
    cohort?: {
      title: string;
      start_date: string;
      end_date: string;
    } | null;
  };
}

export function EnrollmentAccessCard({ enrollment }: EnrollmentAccessCardProps) {
  const { accessStatus, isLoading } = useCourseAccessStatus(
    enrollment.course_id,
    enrollment.cohort_id || undefined
  );

  const handleUnlockCertificate = () => {
    // Navigate to certificate payment page
    window.location.href = `/courses/${enrollment.course?.slug}?action=unlock-certificate`;
  };

  const handleUpgradeAccess = () => {
    // Navigate to enrollment page to upgrade
    window.location.href = `/enroll/${enrollment.course?.slug}`;
  };

  const getAccessBadge = (hasAccess: boolean, reason: string, type: string) => {
    if (reason === 'disabled') {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Lock className="w-3 h-3 mr-1" />
          N/A
        </Badge>
      );
    }
    if (hasAccess) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <Unlock className="w-3 h-3 mr-1" />
          {reason === 'free' ? 'Free' : reason === 'unlocked' ? 'Unlocked' : 'Paid'}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-amber-600 border-amber-300">
        <Lock className="w-3 h-3 mr-1" />
        {reason === 'locked' ? 'Locked' : 'Requires Payment'}
      </Badge>
    );
  };

  return (
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
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground">
                {enrollment.course?.title}
              </h3>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Confirmed
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Approved on {enrollment.approved_at ? format(new Date(enrollment.approved_at), "MMM d, yyyy") : "N/A"}
              {enrollment.cohort?.title && (
                <span> • Cohort: {enrollment.cohort.title}</span>
              )}
            </div>

            {/* Access Status Section */}
            {accessStatus && !isLoading && (
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Your Access Status
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Content:</span>
                    {getAccessBadge(accessStatus.content.hasAccess, accessStatus.content.reason, 'content')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ClipboardCheck className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Assessments:</span>
                    {getAccessBadge(accessStatus.assessment.hasAccess, accessStatus.assessment.reason, 'assessment')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Certificate:</span>
                    {getAccessBadge(accessStatus.certificate.hasAccess, accessStatus.certificate.reason, 'certificate')}
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {accessStatus.certificate.reason === 'requires_payment' && (
                    <Button size="sm" variant="outline" onClick={handleUnlockCertificate}>
                      <Award className="w-3 h-3 mr-1" />
                      Unlock Certificate (₦{accessStatus.certificate.fee?.toLocaleString()})
                    </Button>
                  )}
                  {(!accessStatus.content.hasAccess || !accessStatus.assessment.hasAccess) && (
                    <Button size="sm" variant="outline" onClick={handleUpgradeAccess}>
                      <Unlock className="w-3 h-3 mr-1" />
                      Upgrade Access
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <Button size="sm" asChild>
                <Link to={`/learn/${enrollment.course_id}`}>
                  Continue Learning
                </Link>
              </Button>
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
  );
}

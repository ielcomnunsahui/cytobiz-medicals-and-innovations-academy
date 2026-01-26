import {
  Lock,
  Unlock,
  BookOpen,
  Award,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AccessStatus } from "@/hooks/useCourseAccess";
import { cn } from "@/lib/utils";

interface AccessStatusBadgesProps {
  accessStatus: AccessStatus;
  certificateFee?: number;
  onUnlockCertificate?: () => void;
  onUpgradeAccess?: () => void;
  compact?: boolean;
}

export function AccessStatusBadges({
  accessStatus,
  certificateFee,
  onUnlockCertificate,
  onUpgradeAccess,
  compact = false,
}: AccessStatusBadgesProps) {
  const getStatusIcon = (hasAccess: boolean, reason: string) => {
    if (reason === 'disabled') return <XCircle className="w-4 h-4 text-muted-foreground" />;
    if (reason === 'locked') return <Lock className="w-4 h-4 text-red-500" />;
    if (hasAccess) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    return <Lock className="w-4 h-4 text-amber-600" />;
  };

  const getStatusText = (hasAccess: boolean, reason: string, type: string) => {
    if (reason === 'disabled') return 'Not Available';
    if (reason === 'locked') return 'Locked';
    if (reason === 'free') return 'Free';
    if (reason === 'paid') return 'Unlocked';
    if (reason === 'unlocked') return 'Admin Unlocked';
    if (reason === 'requires_payment') return 'Payment Required';
    return hasAccess ? 'Available' : 'Locked';
  };

  const getStatusBadgeVariant = (hasAccess: boolean, reason: string) => {
    if (reason === 'disabled') return 'outline';
    if (reason === 'locked') return 'destructive';
    if (hasAccess) return 'default';
    return 'secondary';
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={getStatusBadgeVariant(accessStatus.content.hasAccess, accessStatus.content.reason)}
          className="flex items-center gap-1"
        >
          <BookOpen className="w-3 h-3" />
          Content: {getStatusText(accessStatus.content.hasAccess, accessStatus.content.reason, 'content')}
        </Badge>
        <Badge
          variant={getStatusBadgeVariant(accessStatus.assessment.hasAccess, accessStatus.assessment.reason)}
          className="flex items-center gap-1"
        >
          <ClipboardCheck className="w-3 h-3" />
          Assessments: {getStatusText(accessStatus.assessment.hasAccess, accessStatus.assessment.reason, 'assessment')}
        </Badge>
        <Badge
          variant={getStatusBadgeVariant(accessStatus.certificate.hasAccess, accessStatus.certificate.reason)}
          className="flex items-center gap-1"
        >
          <Award className="w-3 h-3" />
          Certificate: {getStatusText(accessStatus.certificate.hasAccess, accessStatus.certificate.reason, 'certificate')}
        </Badge>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Your Access Status</CardTitle>
        <CardDescription>
          {accessStatus.isLegacy 
            ? "This is a legacy course with simplified access rules" 
            : "Your current access level for this course"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content Access */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              accessStatus.content.hasAccess ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"
            )}>
              <BookOpen className={cn(
                "w-4 h-4",
                accessStatus.content.hasAccess ? "text-green-600" : "text-amber-600"
              )} />
            </div>
            <div>
              <p className="font-medium text-sm">Content Access</p>
              <p className="text-xs text-muted-foreground">Lessons, videos, materials</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(accessStatus.content.hasAccess, accessStatus.content.reason)}
            <span className="text-sm font-medium">
              {getStatusText(accessStatus.content.hasAccess, accessStatus.content.reason, 'content')}
            </span>
          </div>
        </div>

        <Separator />

        {/* Assessment Access */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              accessStatus.assessment.hasAccess 
                ? "bg-green-100 dark:bg-green-900/30" 
                : accessStatus.assessment.reason === 'locked'
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-amber-100 dark:bg-amber-900/30"
            )}>
              <ClipboardCheck className={cn(
                "w-4 h-4",
                accessStatus.assessment.hasAccess 
                  ? "text-green-600" 
                  : accessStatus.assessment.reason === 'locked'
                  ? "text-red-600"
                  : "text-amber-600"
              )} />
            </div>
            <div>
              <p className="font-medium text-sm">Assessment Access</p>
              <p className="text-xs text-muted-foreground">Quizzes, assignments, projects</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(accessStatus.assessment.hasAccess, accessStatus.assessment.reason)}
            <span className="text-sm font-medium">
              {getStatusText(accessStatus.assessment.hasAccess, accessStatus.assessment.reason, 'assessment')}
            </span>
          </div>
        </div>

        <Separator />

        {/* Certificate Access */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              accessStatus.certificate.hasAccess 
                ? "bg-green-100 dark:bg-green-900/30" 
                : accessStatus.certificate.reason === 'disabled'
                ? "bg-muted"
                : "bg-amber-100 dark:bg-amber-900/30"
            )}>
              <Award className={cn(
                "w-4 h-4",
                accessStatus.certificate.hasAccess 
                  ? "text-green-600" 
                  : accessStatus.certificate.reason === 'disabled'
                  ? "text-muted-foreground"
                  : "text-amber-600"
              )} />
            </div>
            <div>
              <p className="font-medium text-sm">Certificate</p>
              <p className="text-xs text-muted-foreground">
                {accessStatus.certificate.reason === 'disabled'
                  ? "Not available for this course"
                  : accessStatus.certificate.hasAccess
                  ? "Available upon completion"
                  : `₦${accessStatus.certificate.fee?.toLocaleString()} to unlock`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {accessStatus.certificate.reason === 'requires_payment' && onUnlockCertificate ? (
              <Button size="sm" onClick={onUnlockCertificate}>
                Unlock Certificate
              </Button>
            ) : (
              <>
                {getStatusIcon(accessStatus.certificate.hasAccess, accessStatus.certificate.reason)}
                <span className="text-sm font-medium">
                  {getStatusText(accessStatus.certificate.hasAccess, accessStatus.certificate.reason, 'certificate')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Upgrade CTA */}
        {(!accessStatus.content.hasAccess || !accessStatus.assessment.hasAccess) && onUpgradeAccess && (
          <>
            <Separator />
            <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                <span className="text-sm">Unlock full access to all content</span>
              </div>
              <Button size="sm" onClick={onUpgradeAccess}>
                Upgrade Access
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

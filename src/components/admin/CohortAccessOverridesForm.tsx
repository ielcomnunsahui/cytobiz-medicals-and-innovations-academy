import { useState, useEffect } from "react";
import { Loader2, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  useCohortAccessOverrides,
  useCourseAccessSettings,
  useUpdateCohortAccessOverrides,
  type ContentAccessMode,
  type AssessmentAccessMode,
  type CertificateAccessMode,
} from "@/hooks/useCourseAccess";
import { supabase } from "@/integrations/supabase/client";

interface CohortAccessOverridesFormProps {
  cohortId: string;
  courseId: string;
}

export function CohortAccessOverridesForm({ cohortId, courseId }: CohortAccessOverridesFormProps) {
  const { data: cohortOverrides, isLoading: overridesLoading } = useCohortAccessOverrides(cohortId);
  const { data: courseSettings, isLoading: courseLoading } = useCourseAccessSettings(courseId);
  const updateOverrides = useUpdateCohortAccessOverrides();

  const [useOverrides, setUseOverrides] = useState(false);
  const [formData, setFormData] = useState({
    content_access: null as ContentAccessMode | null,
    assessment_access: null as AssessmentAccessMode | null,
    certificate_access: null as CertificateAccessMode | null,
    certificate_fee: null as number | null,
    promo_enabled: null as boolean | null,
    promo_expiry: null as string | null,
  });

  useEffect(() => {
    if (cohortOverrides) {
      const hasOverrides = 
        cohortOverrides.content_access !== null ||
        cohortOverrides.assessment_access !== null ||
        cohortOverrides.certificate_access !== null ||
        cohortOverrides.certificate_fee !== null ||
        cohortOverrides.promo_enabled !== null;

      setUseOverrides(hasOverrides);
      setFormData({
        content_access: cohortOverrides.content_access as ContentAccessMode | null,
        assessment_access: cohortOverrides.assessment_access as AssessmentAccessMode | null,
        certificate_access: cohortOverrides.certificate_access as CertificateAccessMode | null,
        certificate_fee: cohortOverrides.certificate_fee,
        promo_enabled: cohortOverrides.promo_enabled,
        promo_expiry: cohortOverrides.promo_expiry ? new Date(cohortOverrides.promo_expiry).toISOString().slice(0, 16) : null,
      });
    }
  }, [cohortOverrides]);

  const handleSave = async () => {
    try {
      if (useOverrides) {
        await updateOverrides.mutateAsync({
          cohortId,
          overrides: {
            content_access: formData.content_access,
            assessment_access: formData.assessment_access,
            certificate_access: formData.certificate_access,
            certificate_fee: formData.certificate_fee,
            promo_enabled: formData.promo_enabled,
            promo_expiry: formData.promo_expiry,
          },
        });
        toast.success("Cohort access overrides saved");
      } else {
        // Clear all overrides
        await updateOverrides.mutateAsync({
          cohortId,
          overrides: {
            content_access: null,
            assessment_access: null,
            certificate_access: null,
            certificate_fee: null,
            promo_enabled: null,
            promo_expiry: null,
          },
        });
        toast.success("Cohort now uses course defaults");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save overrides");
    }
  };

  const handleClearOverrides = async () => {
    try {
      await supabase
        .from("cohort_access_overrides")
        .delete()
        .eq("cohort_id", cohortId);
      
      setUseOverrides(false);
      setFormData({
        content_access: null,
        assessment_access: null,
        certificate_access: null,
        certificate_fee: null,
        promo_enabled: null,
        promo_expiry: null,
      });
      toast.success("Overrides cleared, using course defaults");
    } catch (error: any) {
      toast.error("Failed to clear overrides");
    }
  };

  const isLoading = overridesLoading || courseLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Cohort Access Overrides
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Override the course-level access settings for this specific cohort. Leave disabled to use course defaults.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Configure different access rules for this cohort (e.g., free promotional access)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Toggle Override Mode */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium">Enable Cohort Overrides</Label>
            <p className="text-xs text-muted-foreground">
              {useOverrides ? "This cohort uses custom settings" : "Using course-level settings"}
            </p>
          </div>
          <Switch
            checked={useOverrides}
            onCheckedChange={setUseOverrides}
          />
        </div>

        {!useOverrides && courseSettings && (
          <div className="p-4 border border-border rounded-lg bg-muted/30">
            <p className="text-sm font-medium mb-2">Current Course Settings</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Content: {courseSettings.content_access}</Badge>
              <Badge variant="outline">Assessment: {courseSettings.assessment_access}</Badge>
              <Badge variant="outline">Certificate: {courseSettings.certificate_access}</Badge>
              {courseSettings.certificate_fee && (
                <Badge variant="outline">Fee: ₦{courseSettings.certificate_fee.toLocaleString()}</Badge>
              )}
            </div>
          </div>
        )}

        {useOverrides && (
          <div className="space-y-4">
            {/* Content Access */}
            <div className="grid gap-2">
              <Label>Content Access</Label>
              <Select
                value={formData.content_access || "_inherit"}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  content_access: value === "_inherit" ? null : value as ContentAccessMode 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Inherit from course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_inherit">
                    <span className="text-muted-foreground">Inherit from course</span>
                  </SelectItem>
                  <SelectItem value="free">Free - Immediate access after enrollment</SelectItem>
                  <SelectItem value="paid_before_access">Paid - Payment required for access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assessment Access */}
            <div className="grid gap-2">
              <Label>Assessment Access</Label>
              <Select
                value={formData.assessment_access || "_inherit"}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  assessment_access: value === "_inherit" ? null : value as AssessmentAccessMode 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Inherit from course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_inherit">
                    <span className="text-muted-foreground">Inherit from course</span>
                  </SelectItem>
                  <SelectItem value="free">Free - All assessments available</SelectItem>
                  <SelectItem value="paid">Paid - Payment required for assessments</SelectItem>
                  <SelectItem value="locked">Locked - Assessments disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Certificate Access */}
            <div className="grid gap-2">
              <Label>Certificate Access</Label>
              <Select
                value={formData.certificate_access || "_inherit"}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  certificate_access: value === "_inherit" ? null : value as CertificateAccessMode 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Inherit from course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_inherit">
                    <span className="text-muted-foreground">Inherit from course</span>
                  </SelectItem>
                  <SelectItem value="free">Free - Certificate included</SelectItem>
                  <SelectItem value="paid">Paid - Separate certificate fee</SelectItem>
                  <SelectItem value="disabled">Disabled - No certificate available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Certificate Fee */}
            {(formData.certificate_access === "paid" || (!formData.certificate_access && courseSettings?.certificate_access === "paid")) && (
              <div className="grid gap-2">
                <Label>Certificate Fee (₦)</Label>
                <Input
                  type="number"
                  placeholder={courseSettings?.certificate_fee?.toString() || "5000"}
                  value={formData.certificate_fee || ""}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    certificate_fee: e.target.value ? Number(e.target.value) : null 
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use course default ({courseSettings?.certificate_fee ? `₦${courseSettings.certificate_fee.toLocaleString()}` : "₦5,000"})
                </p>
              </div>
            )}

            {/* Promotional Access */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-sm">Promotional Free Access</Label>
                <p className="text-xs text-muted-foreground">
                  Enable free course access for this cohort
                </p>
              </div>
              <Switch
                checked={formData.promo_enabled || false}
                onCheckedChange={(checked) => setFormData({ ...formData, promo_enabled: checked })}
              />
            </div>

            {formData.promo_enabled && (
              <div className="grid gap-2">
                <Label>Promo Expiry Date (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={formData.promo_expiry || ""}
                  onChange={(e) => setFormData({ ...formData, promo_expiry: e.target.value || null })}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for no expiry
                </p>
              </div>
            )}

            {/* Clear Overrides */}
            {cohortOverrides && (
              <Button
                variant="outline"
                type="button"
                onClick={handleClearOverrides}
                className="w-full text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Overrides
              </Button>
            )}
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={updateOverrides.isPending}
          className="w-full"
        >
          {updateOverrides.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : null}
          Save Cohort Settings
        </Button>
      </CardContent>
    </Card>
  );
}

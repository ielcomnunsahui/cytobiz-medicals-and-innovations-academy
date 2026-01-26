import { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  BookOpen,
  Award,
  ClipboardCheck,
  Loader2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  ContentAccessMode,
  AssessmentAccessMode,
  CertificateAccessMode,
  useCourseAccessSettings,
  useUpdateCourseAccessSettings,
} from "@/hooks/useCourseAccess";
import { toast } from "sonner";

interface CourseAccessSettingsFormProps {
  courseId: string;
  onChange?: (settings: CourseAccessFormData) => void;
  embedded?: boolean;
}

export interface CourseAccessFormData {
  content_access: ContentAccessMode;
  assessment_access: AssessmentAccessMode;
  certificate_access: CertificateAccessMode;
  certificate_fee: number;
  promo_enabled: boolean;
  promo_expiry: Date | null;
}

export function CourseAccessSettingsForm({
  courseId,
  onChange,
  embedded = false,
}: CourseAccessSettingsFormProps) {
  const { data: existingSettings, isLoading } = useCourseAccessSettings(courseId);
  const updateSettings = useUpdateCourseAccessSettings();
  
  const [formData, setFormData] = useState<CourseAccessFormData>({
    content_access: 'free',
    assessment_access: 'free',
    certificate_access: 'paid',
    certificate_fee: 5000,
    promo_enabled: false,
    promo_expiry: null,
  });

  useEffect(() => {
    if (existingSettings) {
      setFormData({
        content_access: existingSettings.content_access as ContentAccessMode,
        assessment_access: existingSettings.assessment_access as AssessmentAccessMode,
        certificate_access: existingSettings.certificate_access as CertificateAccessMode,
        certificate_fee: existingSettings.certificate_fee || 5000,
        promo_enabled: existingSettings.promo_enabled || false,
        promo_expiry: existingSettings.promo_expiry ? new Date(existingSettings.promo_expiry) : null,
      });
    }
  }, [existingSettings]);

  const handleChange = (updates: Partial<CourseAccessFormData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onChange?.(newData);
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        courseId,
        settings: {
          content_access: formData.content_access,
          assessment_access: formData.assessment_access,
          certificate_access: formData.certificate_access,
          certificate_fee: formData.certificate_fee,
          promo_enabled: formData.promo_enabled,
          promo_expiry: formData.promo_expiry?.toISOString() || null,
        },
      });
      toast.success("Access settings saved successfully");
    } catch (error: any) {
      toast.error(`Failed to save: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const Wrapper = embedded ? 'div' : Card;
  const ContentWrapper = embedded ? 'div' : CardContent;

  return (
    <div className="space-y-6">
      <div className={cn(!embedded && "grid gap-4 md:grid-cols-3")}>
        {/* Content Access */}
        <div className={cn("space-y-3", embedded && "space-y-2")}>
          <Label className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Content Access
          </Label>
          <Select
            value={formData.content_access}
            onValueChange={(value) => handleChange({ content_access: value as ContentAccessMode })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">
                <div className="flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-green-600" />
                  Free
                </div>
              </SelectItem>
              <SelectItem value="paid_before_access">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Paid Before Access
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {formData.content_access === 'free' 
              ? "Lessons are accessible immediately"
              : "Payment required to view lessons"
            }
          </p>
        </div>

        {/* Assessment Access */}
        <div className={cn("space-y-3", embedded && "space-y-2")}>
          <Label className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" />
            Assessment Access
          </Label>
          <Select
            value={formData.assessment_access}
            onValueChange={(value) => handleChange({ assessment_access: value as AssessmentAccessMode })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">
                <div className="flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-green-600" />
                  Free
                </div>
              </SelectItem>
              <SelectItem value="paid">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Paid
                </div>
              </SelectItem>
              <SelectItem value="locked">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-600" />
                  Locked
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {formData.assessment_access === 'free' 
              ? "Assessments are accessible"
              : formData.assessment_access === 'paid'
              ? "Payment required to submit"
              : "Assessments are completely locked"
            }
          </p>
        </div>

        {/* Certificate Access */}
        <div className={cn("space-y-3", embedded && "space-y-2")}>
          <Label className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Certificate Access
          </Label>
          <Select
            value={formData.certificate_access}
            onValueChange={(value) => handleChange({ certificate_access: value as CertificateAccessMode })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">
                <div className="flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-green-600" />
                  Free
                </div>
              </SelectItem>
              <SelectItem value="paid">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Paid
                </div>
              </SelectItem>
              <SelectItem value="disabled">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Disabled
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {formData.certificate_access === 'free' 
              ? "Certificate is free"
              : formData.certificate_access === 'paid'
              ? "Payment required for certificate"
              : "No certificate available"
            }
          </p>
        </div>
      </div>

      {formData.certificate_access === 'paid' && (
        <div className="space-y-2">
          <Label htmlFor="certificate_fee">Certificate Fee (₦)</Label>
          <Input
            id="certificate_fee"
            type="number"
            min={0}
            value={formData.certificate_fee}
            onChange={(e) => handleChange({ certificate_fee: parseInt(e.target.value) || 0 })}
            className="max-w-xs"
          />
        </div>
      )}

      <Separator />

      {/* Promo Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Promotional Pricing</Label>
            <p className="text-xs text-muted-foreground">Enable special promotional access</p>
          </div>
          <Switch
            checked={formData.promo_enabled}
            onCheckedChange={(checked) => handleChange({ promo_enabled: checked })}
          />
        </div>

        {formData.promo_enabled && (
          <div className="space-y-2">
            <Label>Promo Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full max-w-xs justify-start text-left font-normal",
                    !formData.promo_expiry && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.promo_expiry ? format(formData.promo_expiry, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.promo_expiry || undefined}
                  onSelect={(date) => handleChange({ promo_expiry: date || null })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {!embedded && (
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={updateSettings.isPending}>
            {updateSettings.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Access Settings"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

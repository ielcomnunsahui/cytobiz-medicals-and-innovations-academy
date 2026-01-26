import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Unlock,
  BookOpen,
  Award,
  ClipboardCheck,
  Settings,
  Loader2,
  Save,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  usePlatformAccessDefaults,
  ContentAccessMode,
  AssessmentAccessMode,
  CertificateAccessMode,
} from "@/hooks/useCourseAccess";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminAccessSettings() {
  const queryClient = useQueryClient();
  const { data: defaults, isLoading } = usePlatformAccessDefaults();
  const [isSaving, setIsSaving] = useState(false);
  
  const [platformSettings, setPlatformSettings] = useState({
    content_access: 'free' as ContentAccessMode,
    assessment_access: 'free' as AssessmentAccessMode,
    certificate_access: 'paid' as CertificateAccessMode,
    default_certificate_fee: 5000,
  });

  // Update state when data loads
  useState(() => {
    if (defaults) {
      setPlatformSettings({
        content_access: defaults.content_access as ContentAccessMode,
        assessment_access: defaults.assessment_access as AssessmentAccessMode,
        certificate_access: defaults.certificate_access as CertificateAccessMode,
        default_certificate_fee: defaults.default_certificate_fee || 5000,
      });
    }
  });

  const handleSavePlatformDefaults = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("platform_access_defaults")
        .update({
          content_access: platformSettings.content_access,
          assessment_access: platformSettings.assessment_access,
          certificate_access: platformSettings.certificate_access,
          default_certificate_fee: platformSettings.default_certificate_fee,
        })
        .eq("id", defaults?.id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ["platform-access-defaults"] });
      toast.success("Platform defaults updated successfully");
    } catch (error: any) {
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getAccessIcon = (mode: string) => {
    switch (mode) {
      case 'free':
        return <Unlock className="w-4 h-4 text-green-600" />;
      case 'paid':
      case 'paid_before_access':
        return <Lock className="w-4 h-4 text-amber-600" />;
      case 'locked':
        return <Lock className="w-4 h-4 text-red-600" />;
      case 'disabled':
        return <Lock className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Shield className="w-8 h-8" />
              Access Control
            </h1>
            <p className="text-muted-foreground">
              Configure content, assessment, and certificate access for all courses
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Global Access Control System</p>
                <p className="text-sm text-muted-foreground">
                  These settings define the default behavior for all courses. You can override these 
                  settings at the course level (Admin → Courses → Edit) or cohort level (Admin → Cohorts → Edit).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="platform" className="space-y-6">
          <TabsList>
            <TabsTrigger value="platform">Platform Defaults</TabsTrigger>
            <TabsTrigger value="behavior">Behavior Rules</TabsTrigger>
            <TabsTrigger value="help">Help & Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="platform" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Content Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="w-5 h-5" />
                    Content Access
                  </CardTitle>
                  <CardDescription>
                    Controls access to lessons, videos, and materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={platformSettings.content_access}
                    onValueChange={(value) => 
                      setPlatformSettings({ ...platformSettings, content_access: value as ContentAccessMode })
                    }
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
                    {platformSettings.content_access === 'free' 
                      ? "Learners can view lessons immediately after enrollment"
                      : "Payment required before accessing any lesson content"
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Assessment Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ClipboardCheck className="w-5 h-5" />
                    Assessment Access
                  </CardTitle>
                  <CardDescription>
                    Controls access to quizzes, assignments, and projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={platformSettings.assessment_access}
                    onValueChange={(value) => 
                      setPlatformSettings({ ...platformSettings, assessment_access: value as AssessmentAccessMode })
                    }
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
                          Locked (Admin Only)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {platformSettings.assessment_access === 'free' 
                      ? "Learners can take assessments freely"
                      : platformSettings.assessment_access === 'paid'
                      ? "Learners can view but not submit until payment"
                      : "Assessments are completely locked"
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Certificate Access */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="w-5 h-5" />
                    Certificate Access
                  </CardTitle>
                  <CardDescription>
                    Controls certificate eligibility and download
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={platformSettings.certificate_access}
                    onValueChange={(value) => 
                      setPlatformSettings({ ...platformSettings, certificate_access: value as CertificateAccessMode })
                    }
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
                  
                  {platformSettings.certificate_access === 'paid' && (
                    <div className="space-y-2">
                      <Label htmlFor="certificate_fee">Default Certificate Fee (₦)</Label>
                      <Input
                        id="certificate_fee"
                        type="number"
                        min={0}
                        value={platformSettings.default_certificate_fee}
                        onChange={(e) => setPlatformSettings({ 
                          ...platformSettings, 
                          default_certificate_fee: parseInt(e.target.value) || 0 
                        })}
                      />
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {platformSettings.certificate_access === 'free' 
                      ? "Certificates are free after course completion"
                      : platformSettings.certificate_access === 'paid'
                      ? "Learners must pay to unlock their certificate"
                      : "No certificates will be issued"
                    }
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSavePlatformDefaults} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Platform Defaults
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Behavior Rules</CardTitle>
                <CardDescription>
                  How the system enforces access based on settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Content Access Rules
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5 shrink-0">Free</Badge>
                        <span>Learner can view lessons immediately after enrollment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5 shrink-0">Paid</Badge>
                        <span>Payment required before accessing any lesson</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4" />
                      Assessment Access Rules
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5 shrink-0">Free</Badge>
                        <span>Learner can take assessments freely</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5 shrink-0">Paid</Badge>
                        <span>Learner sees assessments but cannot submit until payment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5 shrink-0">Locked</Badge>
                        <span>Assessments are hidden or completely inaccessible</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Certificate Access Rules
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5 shrink-0">Free</Badge>
                        <span>Certificate available immediately upon completion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5 shrink-0">Paid</Badge>
                        <span>Learner can complete course but certificate is locked until payment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5 shrink-0">Disabled</Badge>
                        <span>No certificate is generated for this course</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Override Priority
                    </h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-background px-2 py-0.5 rounded">1.</span>
                        <span>Cohort overrides (highest priority)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-background px-2 py-0.5 rounded">2.</span>
                        <span>Course settings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-background px-2 py-0.5 rounded">3.</span>
                        <span>Platform defaults (lowest priority)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Control Documentation</CardTitle>
                <CardDescription>
                  Learn how to configure access settings effectively
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <h4>Common Configurations</h4>
                
                <div className="grid gap-4 md:grid-cols-2 not-prose">
                  <div className="p-4 border rounded-lg space-y-2">
                    <h5 className="font-medium">Free Course with Paid Certificate</h5>
                    <p className="text-sm text-muted-foreground">
                      Content: Free | Assessment: Free | Certificate: Paid
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Great for building audience with monetized credentials.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg space-y-2">
                    <h5 className="font-medium">Premium Course</h5>
                    <p className="text-sm text-muted-foreground">
                      Content: Paid | Assessment: Paid | Certificate: Free
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All-access after enrollment payment, certificate included.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg space-y-2">
                    <h5 className="font-medium">Free Preview Model</h5>
                    <p className="text-sm text-muted-foreground">
                      Content: Free (first module) | Assessment: Locked | Certificate: Paid
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Let learners preview before committing.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg space-y-2">
                    <h5 className="font-medium">Promotional Cohort</h5>
                    <p className="text-sm text-muted-foreground">
                      Override cohort to: Content: Free | Certificate: Free
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Run a free promotional cohort while keeping course paid.
                    </p>
                  </div>
                </div>

                <h4 className="mt-6">Admin Manual Overrides</h4>
                <p>
                  Admins can manually unlock access for specific users without requiring payment:
                </p>
                <ul>
                  <li>Go to Admin → Enrollments → Find the user</li>
                  <li>Click "Manage Access" to grant content, assessment, or certificate access</li>
                  <li>Add a reason for audit purposes</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

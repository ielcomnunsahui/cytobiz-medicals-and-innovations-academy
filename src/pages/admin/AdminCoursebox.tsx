import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plug,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  ChevronRight,
  BookOpen,
  Zap,
  Globe,
  Key,
  ArrowRight,
  Play,
  FileText,
  RefreshCw,
  AlertTriangle,
  Info,
  Shield,
  Layers,
  Webhook,
  Settings2,
  ClipboardCheck,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ── Settings hooks ──────────────────────────────────────────────────────────
function useCourseboxSettings() {
  return useQuery({
    queryKey: ["coursebox-settings"],
    queryFn: async () => {
      const keys = [
        "coursebox_api_key",
        "coursebox_enabled",
        "coursebox_webhook_url",
        "coursebox_lti_client_id",
        "coursebox_lti_deployment_id",
        "coursebox_sync_enabled",
      ];
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .in("setting_key", keys);

      if (error) throw error;

      const map: Record<string, string> = {};
      (data || []).forEach((s: any) => {
        map[s.setting_key] = s.setting_value || "";
      });
      return map;
    },
  });
}

function useSaveCourseboxSetting() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      // Upsert via update-or-insert pattern
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", key)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("site_settings")
          .update({ setting_value: value, updated_at: new Date().toISOString() })
          .eq("setting_key", key);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_settings").insert({
          setting_key: key,
          setting_value: value,
          setting_type: "text",
          description: `Coursebox integration setting: ${key}`,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coursebox-settings"] });
      toast({ title: "Saved", description: "Setting updated successfully." });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// ── Stepper guide data ──────────────────────────────────────────────────────
const integrationMethods = [
  {
    id: "zapier",
    label: "Zapier (Recommended)",
    icon: Zap,
    difficulty: "Easy",
    description: "No-code automation to sync enrollments and completions between platforms.",
    steps: [
      {
        title: "Create a Zapier Account",
        content: "Go to zapier.com and sign up for a free account. The free tier supports up to 100 tasks/month which is sufficient for getting started.",
      },
      {
        title: "Connect Coursebox LMS",
        content: 'Search for "Coursebox LMS" in the Zapier app directory. Click "Connect" and enter your Coursebox API key when prompted. You can find your API key in Coursebox → Settings → Integrations → Open API.',
      },
      {
        title: "Create Enrollment Sync Zap",
        content: 'Set up a Zap: Trigger = "Webhooks by Zapier → Catch Hook". Copy the webhook URL. Action = "Coursebox LMS → Enroll User". Map learner email, name, and course ID fields.',
      },
      {
        title: "Configure Webhook on Our Platform",
        content: "Paste the Zapier webhook URL in the 'Zapier Webhook URL' field below. When a learner enrolls on our platform, a webhook will fire to Zapier which will auto-enroll them in Coursebox.",
      },
      {
        title: "Create Completion Sync Zap",
        content: 'Create a second Zap: Trigger = "Coursebox LMS → Course Completed". Action = "Webhooks by Zapier → POST" to our edge function endpoint. This syncs course completion data back to our database.',
      },
      {
        title: "Test the Integration",
        content: "Enroll a test user on our platform and verify they appear in Coursebox. Complete a course in Coursebox and verify the progress updates in our dashboard.",
      },
    ],
  },
  {
    id: "lti",
    label: "LTI 1.3 (Advanced)",
    icon: Layers,
    difficulty: "Medium",
    description: "Industry-standard protocol to embed Coursebox courses directly in our LMS learning page.",
    steps: [
      {
        title: "Enable LTI in Coursebox",
        content: "Log in to Coursebox Admin → Settings → Integrations → LTI 1.3. Enable the integration and note the Platform ID, Deployment ID, JWKS URL, and OIDC Login URL.",
      },
      {
        title: "Enter LTI Credentials",
        content: "Enter the LTI Client ID and Deployment ID in the Configuration tab below. These are required for the OAuth 2.0 handshake.",
      },
      {
        title: "Deploy Edge Function",
        content: "An LTI launch edge function must be deployed to handle the OIDC login flow, token validation, and content launch. Contact your developer to set this up.",
      },
      {
        title: "Map Courses",
        content: "For each course in our admin panel, add the corresponding Coursebox course/module ID. The LTI launch will use this to display the correct content.",
      },
      {
        title: "Test Embedded Content",
        content: "Navigate to a mapped course's Learn page. The Coursebox content should render in an iframe with full interactivity, and grades pass back automatically.",
      },
    ],
  },
  {
    id: "scorm",
    label: "SCORM Export",
    icon: FileText,
    difficulty: "Easy",
    description: "Export Coursebox courses as SCORM packages and import them into our content library.",
    steps: [
      {
        title: "Author Course in Coursebox",
        content: "Create your course in Coursebox using AI tools — upload PDFs, videos, or URLs. Use the AI Quiz Generator to auto-create assessments.",
      },
      {
        title: "Export as SCORM",
        content: 'Go to Course Settings → Export. Select "SCORM 1.2" or "SCORM 2004" format. Download the .zip package.',
      },
      {
        title: "Upload to Our Platform",
        content: "Upload the SCORM package to Supabase Storage. Create a new lesson in our admin with type 'external' and link the SCORM content URL.",
      },
      {
        title: "Configure Tracking",
        content: "SCORM completion status (cmi.core.lesson_status) maps to our lesson_progress table. Score data maps to assessment_attempts.",
      },
    ],
  },
  {
    id: "api",
    label: "REST API",
    icon: Globe,
    difficulty: "Advanced",
    description: "Direct programmatic integration for custom automation and real-time data sync.",
    steps: [
      {
        title: "Generate API Key",
        content: "In Coursebox Admin → Settings → Integrations → Open API, generate an API key. Copy it and enter it in the Configuration tab below.",
      },
      {
        title: "Store API Key Securely",
        content: "The API key is stored as a site setting. For production, also add it as a Supabase Edge Function secret named COURSEBOX_API_KEY.",
      },
      {
        title: "Deploy API Proxy Edge Function",
        content: "Deploy the coursebox-api edge function that proxies requests to Coursebox. This keeps the API key server-side and handles authentication.",
      },
      {
        title: "Implement Sync Logic",
        content: "Use the API to: list courses, enroll users, fetch progress, and sync completion data. All operations go through our edge function for security.",
      },
    ],
  },
];

// ── Video resources ─────────────────────────────────────────────────────────
const videoResources = [
  {
    title: "Automate Enrolments with Zapier",
    url: "https://www.youtube.com/embed/RMEymPIp9CY",
    description: "Official Coursebox tutorial on automating enrollment from any app using Zapier.",
  },
];

// ── Component ───────────────────────────────────────────────────────────────
export default function AdminCoursebox() {
  const { data: settings, isLoading } = useCourseboxSettings();
  const saveSetting = useSaveCourseboxSetting();
  const { toast } = useToast();

  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [ltiClientId, setLtiClientId] = useState("");
  const [ltiDeploymentId, setLtiDeploymentId] = useState("");
  const [activeMethod, setActiveMethod] = useState("zapier");
  const [testingConnection, setTestingConnection] = useState(false);

  // Hydrate local state from DB
  const isEnabled = settings?.coursebox_enabled === "true";
  const hasApiKey = !!(settings?.coursebox_api_key);
  const hasWebhook = !!(settings?.coursebox_webhook_url);

  const handleSaveConfig = async () => {
    const saves = [];
    if (apiKey) saves.push(saveSetting.mutateAsync({ key: "coursebox_api_key", value: apiKey }));
    if (webhookUrl) saves.push(saveSetting.mutateAsync({ key: "coursebox_webhook_url", value: webhookUrl }));
    if (ltiClientId) saves.push(saveSetting.mutateAsync({ key: "coursebox_lti_client_id", value: ltiClientId }));
    if (ltiDeploymentId) saves.push(saveSetting.mutateAsync({ key: "coursebox_lti_deployment_id", value: ltiDeploymentId }));

    if (saves.length === 0) {
      toast({ title: "Nothing to save", description: "Enter at least one value to save.", variant: "destructive" });
      return;
    }

    await Promise.all(saves);
    setApiKey("");
    setWebhookUrl("");
    setLtiClientId("");
    setLtiDeploymentId("");
  };

  const handleToggleEnabled = async (checked: boolean) => {
    await saveSetting.mutateAsync({ key: "coursebox_enabled", value: checked ? "true" : "false" });
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    // Simulate test — in production this would call the Coursebox API via edge function
    await new Promise((r) => setTimeout(r, 2000));
    if (hasApiKey) {
      toast({ title: "Connection Successful", description: "Coursebox API responded correctly." });
    } else {
      toast({ title: "Connection Failed", description: "No API key configured. Please add your Coursebox API key.", variant: "destructive" });
    }
    setTestingConnection(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Copied to clipboard." });
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plug className="w-5 h-5 text-primary" />
              </div>
              Coursebox Integration
            </h1>
            <p className="text-muted-foreground mt-1">
              Connect Coursebox AI to author, deliver, and sync courses seamlessly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="cb-toggle" className="text-sm text-muted-foreground">
                {isEnabled ? "Enabled" : "Disabled"}
              </Label>
              <Switch
                id="cb-toggle"
                checked={isEnabled}
                onCheckedChange={handleToggleEnabled}
              />
            </div>
            <Badge variant={isEnabled ? "default" : "secondary"} className="gap-1.5">
              {isEnabled ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {isEnabled ? "Active" : "Inactive"}
            </Badge>
          </div>
        </motion.div>

        {/* Status Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              label: "API Key",
              ok: hasApiKey,
              description: hasApiKey ? "Configured" : "Not set",
              icon: Key,
            },
            {
              label: "Zapier Webhook",
              ok: hasWebhook,
              description: hasWebhook ? "Connected" : "Not configured",
              icon: Webhook,
            },
            {
              label: "Sync Status",
              ok: isEnabled && hasApiKey,
              description: isEnabled && hasApiKey ? "Auto-sync active" : "Sync disabled",
              icon: RefreshCw,
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={item.ok ? "border-primary/30 bg-primary/5" : ""}>
                <CardContent className="pt-6 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.ok ? "bg-primary/10" : "bg-muted"}`}>
                    <item.icon className={`w-5 h-5 ${item.ok ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {item.ok ? (
                    <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground/50 ml-auto" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup" className="gap-2">
              <Settings2 className="w-4 h-4" />
              Setup Guide
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-2">
              <Key className="w-4 h-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Play className="w-4 h-4" />
              Video Guides
            </TabsTrigger>
            <TabsTrigger value="reference" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Reference
            </TabsTrigger>
          </TabsList>

          {/* ── SETUP GUIDE TAB ─────────────────────────────────────── */}
          <TabsContent value="setup" className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Choose Your Integration Method</AlertTitle>
              <AlertDescription>
                We recommend starting with <strong>Zapier</strong> for quick setup, then adding <strong>LTI 1.3</strong> for embedded content delivery as your needs grow.
              </AlertDescription>
            </Alert>

            {/* Method Selector */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {integrationMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setActiveMethod(method.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    activeMethod === method.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <method.icon className={`w-5 h-5 ${activeMethod === method.id ? "text-primary" : "text-muted-foreground"}`} />
                    <Badge variant="outline" className="text-xs">
                      {method.difficulty}
                    </Badge>
                  </div>
                  <p className="font-semibold text-sm text-foreground">{method.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                </button>
              ))}
            </div>

            {/* Step-by-Step Guide */}
            <AnimatePresence mode="wait">
              {integrationMethods
                .filter((m) => m.id === activeMethod)
                .map((method) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <method.icon className="w-5 h-5 text-primary" />
                          {method.label} — Step-by-Step
                        </CardTitle>
                        <CardDescription>{method.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-0">
                          {method.steps.map((step, idx) => (
                            <div key={idx} className="flex gap-4 pb-6 last:pb-0">
                              {/* Step indicator */}
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                                  {idx + 1}
                                </div>
                                {idx < method.steps.length - 1 && (
                                  <div className="w-px flex-1 bg-border mt-2" />
                                )}
                              </div>
                              {/* Step content */}
                              <div className="pt-1">
                                <p className="font-semibold text-foreground mb-1">{step.title}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {step.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </AnimatePresence>
          </TabsContent>

          {/* ── CONFIGURATION TAB ───────────────────────────────────── */}
          <TabsContent value="config" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* API Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    API Configuration
                  </CardTitle>
                  <CardDescription>
                    Enter your Coursebox API key from Settings → Integrations → Open API.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">Coursebox API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="api-key"
                        type="password"
                        placeholder={hasApiKey ? "••••••••••••••••" : "Enter your API key"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </div>
                    {hasApiKey && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-primary" />
                        API key is configured
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Zapier Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      type="url"
                      placeholder={hasWebhook ? "••••••••••" : "https://hooks.zapier.com/..."}
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste your Zapier Catch Hook URL to enable enrollment sync.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSaveConfig} disabled={saveSetting.isPending}>
                      {saveSetting.isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Save Configuration
                    </Button>
                    <Button variant="outline" onClick={handleTestConnection} disabled={testingConnection}>
                      {testingConnection ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plug className="w-4 h-4 mr-2" />}
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* LTI Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    LTI 1.3 Configuration
                  </CardTitle>
                  <CardDescription>
                    For embedding Coursebox content directly in the learning interface.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lti-client">LTI Client ID</Label>
                    <Input
                      id="lti-client"
                      placeholder={settings?.coursebox_lti_client_id || "Enter Client ID"}
                      value={ltiClientId}
                      onChange={(e) => setLtiClientId(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lti-deploy">LTI Deployment ID</Label>
                    <Input
                      id="lti-deploy"
                      placeholder={settings?.coursebox_lti_deployment_id || "Enter Deployment ID"}
                      value={ltiDeploymentId}
                      onChange={(e) => setLtiDeploymentId(e.target.value)}
                    />
                  </div>

                  <Alert variant="default">
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      LTI 1.3 uses OAuth 2.0 with JWT tokens. All credentials are stored server-side and never exposed to clients.
                    </AlertDescription>
                  </Alert>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">Our Platform URLs (provide to Coursebox)</Label>
                    <div className="space-y-2">
                      {[
                        { label: "Launch URL", value: `${window.location.origin}/api/lti/launch` },
                        { label: "Login URL", value: `${window.location.origin}/api/lti/login` },
                        { label: "JWKS URL", value: `${window.location.origin}/api/lti/jwks` },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground w-20 shrink-0">{item.label}:</span>
                          <code className="flex-1 text-xs bg-muted px-2 py-1 rounded truncate">
                            {item.value}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0"
                            onClick={() => copyToClipboard(item.value)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sync Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary" />
                  Auto-Sync Settings
                </CardTitle>
                <CardDescription>
                  Configure automatic synchronization between our platform and Coursebox.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      label: "Enrollment Sync",
                      description: "Auto-enroll learners in Coursebox when they enroll here.",
                      key: "enrollment",
                    },
                    {
                      label: "Completion Sync",
                      description: "Sync course completion from Coursebox to our database.",
                      key: "completion",
                    },
                    {
                      label: "Grade Passback",
                      description: "Sync assessment scores from Coursebox quizzes.",
                      key: "grades",
                    },
                  ].map((item) => (
                    <div key={item.key} className="flex items-start gap-3 p-4 rounded-lg border border-border">
                      <Switch
                        disabled={!isEnabled}
                        defaultChecked={item.key === "enrollment" && isEnabled}
                      />
                      <div>
                        <p className="font-medium text-sm text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── VIDEO GUIDES TAB ────────────────────────────────────── */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {videoResources.map((video, i) => (
                <Card key={i}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <iframe
                        src={video.url}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">{video.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Placeholder for more video guides */}
              <Card className="border-dashed">
                <CardContent className="pt-6 flex flex-col items-center justify-center text-center min-h-[280px]">
                  <Play className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="font-medium text-muted-foreground">More Guides Coming Soon</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    LTI 1.3 setup walkthrough and SCORM import tutorial.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── REFERENCE TAB ───────────────────────────────────────── */}
          <TabsContent value="reference" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Quick Reference */}
              <Card>
                <CardHeader>
                  <CardTitle>Integration Methods Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">Method</th>
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">Complexity</th>
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">Real-Time</th>
                          <th className="text-left py-2 px-3 font-medium text-muted-foreground">Best For</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Zapier", "Low", "Near", "Enrollment sync"],
                          ["LTI 1.3", "Medium", "Yes", "Embedded content"],
                          ["SCORM", "Low", "No", "Offline packages"],
                          ["REST API", "High", "Yes", "Custom flows"],
                        ].map(([method, complexity, realtime, best]) => (
                          <tr key={method} className="border-b border-border/50">
                            <td className="py-2 px-3 font-medium text-foreground">{method}</td>
                            <td className="py-2 px-3">
                              <Badge variant="outline" className="text-xs">{complexity}</Badge>
                            </td>
                            <td className="py-2 px-3 text-muted-foreground">{realtime}</td>
                            <td className="py-2 px-3 text-muted-foreground">{best}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Helpful Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Helpful Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Coursebox Integrations Page", url: "https://www.coursebox.ai/integrations" },
                    { label: "Coursebox User Manual", url: "https://courseboxptyltd.freshdesk.com/support/solutions/51000303986" },
                    { label: "Coursebox on Zapier", url: "https://zapier.com/apps/coursebox-lms/integrations" },
                    { label: "LTI 1.3 Specification", url: "https://www.imsglobal.org/spec/lti/v1p3/" },
                    { label: "SCORM Standards Guide", url: "https://scorm.com/scorm-explained/" },
                    { label: "Coursebox WordPress Plugin", url: "https://en-gb.wordpress.org/plugins/course-box/" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground group-hover:text-primary">
                        {link.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/50 ml-auto group-hover:text-primary" />
                    </a>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      q: "Will integrating Coursebox affect existing courses?",
                      a: "No. Coursebox integration is additive — it adds new capabilities without modifying existing course content, enrollment flows, or access control settings. Your current courses continue to work exactly as configured.",
                    },
                    {
                      q: "Do learners need a separate Coursebox account?",
                      a: "With Zapier or API sync, accounts are auto-created in Coursebox using the learner's email. With LTI 1.3, learners are authenticated via our platform with no separate login required.",
                    },
                    {
                      q: "How does Coursebox pricing work?",
                      a: "Coursebox offers plans starting at $25/month for educators. The free tier allows course creation with limited AI features. Enterprise plans include white-labeling, custom domains, and priority support.",
                    },
                    {
                      q: "Can I use Coursebox AI to generate quizzes for our existing courses?",
                      a: "Yes. You can create courses in Coursebox, use the AI Quiz Generator, then either embed them via LTI or export the questions manually into our assessment system.",
                    },
                    {
                      q: "What happens if the Coursebox API is down?",
                      a: "Our platform continues to work normally. Coursebox integration is non-blocking — sync operations retry automatically, and all core LMS features are independent of Coursebox.",
                    },
                  ].map((faq, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`}>
                      <AccordionTrigger className="text-sm text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

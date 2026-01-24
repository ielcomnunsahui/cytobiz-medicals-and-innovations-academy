import { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Loader2,
  Settings,
  Globe,
  BarChart3,
  FileText,
  Trash2,
  Edit,
  CreditCard,
  Building2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FormBuilder, FormField } from "@/components/admin/FormBuilder";
import { useAdminSettings, useUpdateSetting, useCreateSetting } from "@/hooks/useAdminData";
import { useAdminCourses } from "@/hooks/useAdminData";
import {
  useRegistrationForms,
  useCreateRegistrationForm,
  useDeleteRegistrationForm,
  useSaveFormFields,
  useUpdateRegistrationForm,
} from "@/hooks/useRegistrationForms";
import { toast } from "sonner";

export default function AdminSettings() {
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [deletingFormId, setDeletingFormId] = useState<string | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [newSetting, setNewSetting] = useState({
    setting_key: "",
    setting_value: "",
    setting_type: "text",
    description: "",
  });
  const [newForm, setNewForm] = useState({
    name: "",
    course_id: "",
    course_type: "" as "cohort" | "self_paced" | "",
    is_active: true,
  });

  const { data: settings, isLoading: settingsLoading } = useAdminSettings();
  const { data: courses } = useAdminCourses();
  const { data: registrationForms, isLoading: formsLoading } = useRegistrationForms();
  const updateSetting = useUpdateSetting();
  const createSetting = useCreateSetting();
  const createForm = useCreateRegistrationForm();
  const updateForm = useUpdateRegistrationForm();
  const deleteForm = useDeleteRegistrationForm();
  const saveFields = useSaveFormFields();

  // Load form fields when editing
  useEffect(() => {
    if (editingFormId && registrationForms) {
      const form = registrationForms.find((f: any) => f.id === editingFormId);
      if (form?.fields) {
        setFormFields(
          form.fields.map((f: any) => ({
            id: f.id,
            field_key: f.field_key,
            field_type: f.field_type,
            label: f.label,
            placeholder: f.placeholder,
            help_text: f.help_text,
            required: f.required,
            options: f.options?.items || [],
            order_index: f.order_index,
          }))
        );
      } else {
        setFormFields([]);
      }
    }
  }, [editingFormId, registrationForms]);

  // Get grouped settings by prefix (excluding payment settings handled separately)
  const groupedSettings = settings?.reduce((acc, setting) => {
    const prefix = setting.setting_key.split("_")[0];
    if (prefix === "payment" || prefix === "bank") return acc;
    if (!acc[prefix]) acc[prefix] = [];
    acc[prefix].push(setting);
    return acc;
  }, {} as Record<string, typeof settings>);

  // Get payment settings specifically
  const paymentSettings = settings?.reduce((acc: Record<string, any>, s) => {
    acc[s.setting_key] = s;
    return acc;
  }, {}) || {};

  const handleChange = (id: string, value: string) => {
    setEditingSettings({ ...editingSettings, [id]: value });
  };

  const handleSave = async (setting: any) => {
    const newValue = editingSettings[setting.id];
    if (newValue !== undefined && newValue !== setting.setting_value) {
      await updateSetting.mutateAsync({ id: setting.id, setting_value: newValue });
      const newEditingSettings = { ...editingSettings };
      delete newEditingSettings[setting.id];
      setEditingSettings(newEditingSettings);
    }
  };

  const handleTogglePaymentMethod = async (key: string, enabled: boolean) => {
    const setting = paymentSettings[key];
    if (setting) {
      await updateSetting.mutateAsync({ id: setting.id, setting_value: String(enabled) });
    } else {
      await createSetting.mutateAsync({
        setting_key: key,
        setting_value: String(enabled),
        setting_type: "boolean",
        description: `Enable/disable ${key.replace(/_/g, " ")}`,
      });
    }
  };

  const handleSaveBankDetails = async () => {
    const bankFields = [
      { key: "bank_transfer_bank_name", label: "Bank name" },
      { key: "bank_transfer_account_name", label: "Account holder name" },
      { key: "bank_transfer_account_number", label: "Account number" },
      { key: "bank_transfer_routing_number", label: "Routing number" },
      { key: "bank_transfer_swift_code", label: "SWIFT code" },
      { key: "bank_transfer_payment_instructions", label: "Payment instructions" },
    ];

    for (const field of bankFields) {
      const setting = paymentSettings[field.key];
      const newValue = editingSettings[setting?.id];
      if (newValue !== undefined && newValue !== setting?.setting_value) {
        await updateSetting.mutateAsync({ id: setting.id, setting_value: newValue });
      }
    }
    toast.success("Bank details saved");
    setEditingSettings({});
  };

  const handleCreateSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSetting.mutateAsync(newSetting);
    setNewSetting({
      setting_key: "",
      setting_value: "",
      setting_type: "text",
      description: "",
    });
    setIsCreateOpen(false);
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await createForm.mutateAsync({
      name: newForm.name,
      course_id: newForm.course_id || null,
      course_type: newForm.course_type || null,
      is_active: newForm.is_active,
    });
    setNewForm({ name: "", course_id: "", course_type: "", is_active: true });
    setIsFormModalOpen(false);
  };

  const handleDeleteForm = async () => {
    if (deletingFormId) {
      await deleteForm.mutateAsync(deletingFormId);
      setDeletingFormId(null);
    }
  };

  const handleSaveFields = async () => {
    if (editingFormId) {
      await saveFields.mutateAsync({ formId: editingFormId, fields: formFields });
    }
  };

  const getGroupIcon = (group: string) => {
    switch (group) {
      case "stat":
        return BarChart3;
      case "site":
        return Globe;
      default:
        return Settings;
    }
  };

  const getGroupTitle = (group: string) => {
    switch (group) {
      case "stat":
        return "Statistics";
      case "site":
        return "Site Configuration";
      default:
        return group.charAt(0).toUpperCase() + group.slice(1) + " Settings";
    }
  };

  const formatSettingLabel = (key: string) => {
    return key
      .split("_")
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure payment methods, site settings, and registration forms</p>
        </div>

        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="forms" className="gap-2">
              <FileText className="w-4 h-4" />
              Forms
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab (merged Payments + General) */}
          <TabsContent value="settings" className="space-y-8">
            {/* Payment Methods Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Payment Methods</h2>
                  <p className="text-sm text-muted-foreground">Enable payment gateways for enrollment</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Stripe */}
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Stripe</CardTitle>
                          <CardDescription className="text-xs">Credit cards</CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={paymentSettings["payment_stripe_enabled"]?.setting_value === "true"}
                        onCheckedChange={(v) => handleTogglePaymentMethod("payment_stripe_enabled", v)}
                      />
                    </div>
                  </CardHeader>
                </Card>

                {/* Paystack */}
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full" />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Paystack</CardTitle>
                          <CardDescription className="text-xs">African payments</CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={paymentSettings["payment_paystack_enabled"]?.setting_value === "true"}
                        onCheckedChange={(v) => handleTogglePaymentMethod("payment_paystack_enabled", v)}
                      />
                    </div>
                  </CardHeader>
                </Card>

                {/* Bank Transfer */}
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full" />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Bank Transfer</CardTitle>
                          <CardDescription className="text-xs">Manual verification</CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={paymentSettings["payment_bank_transfer_enabled"]?.setting_value === "true"}
                        onCheckedChange={(v) => handleTogglePaymentMethod("payment_bank_transfer_enabled", v)}
                      />
                    </div>
                  </CardHeader>
                </Card>
              </div>

              {/* Bank Details Form - Collapsible */}
              {paymentSettings["payment_bank_transfer_enabled"]?.setting_value === "true" && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Bank Account Details</CardTitle>
                    <CardDescription>
                      These details will be shown to users who choose bank transfer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Bank Name</Label>
                        <Input
                          placeholder="e.g., First Bank"
                          value={
                            editingSettings[paymentSettings["bank_transfer_bank_name"]?.id] ??
                            paymentSettings["bank_transfer_bank_name"]?.setting_value ?? ""
                          }
                          onChange={(e) =>
                            handleChange(paymentSettings["bank_transfer_bank_name"]?.id, e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Account Holder Name</Label>
                        <Input
                          placeholder="e.g., Cytobiz Academy"
                          value={
                            editingSettings[paymentSettings["bank_transfer_account_name"]?.id] ??
                            paymentSettings["bank_transfer_account_name"]?.setting_value ?? ""
                          }
                          onChange={(e) =>
                            handleChange(paymentSettings["bank_transfer_account_name"]?.id, e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Account Number</Label>
                        <Input
                          placeholder="e.g., 1234567890"
                          value={
                            editingSettings[paymentSettings["bank_transfer_account_number"]?.id] ??
                            paymentSettings["bank_transfer_account_number"]?.setting_value ?? ""
                          }
                          onChange={(e) =>
                            handleChange(paymentSettings["bank_transfer_account_number"]?.id, e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Routing/Sort Code</Label>
                        <Input
                          placeholder="e.g., 021000021"
                          value={
                            editingSettings[paymentSettings["bank_transfer_routing_number"]?.id] ??
                            paymentSettings["bank_transfer_routing_number"]?.setting_value ?? ""
                          }
                          onChange={(e) =>
                            handleChange(paymentSettings["bank_transfer_routing_number"]?.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Instructions</Label>
                      <Textarea
                        placeholder="Instructions shown to users..."
                        rows={2}
                        value={
                          editingSettings[paymentSettings["bank_transfer_payment_instructions"]?.id] ??
                          paymentSettings["bank_transfer_payment_instructions"]?.setting_value ?? ""
                        }
                        onChange={(e) =>
                          handleChange(paymentSettings["bank_transfer_payment_instructions"]?.id, e.target.value)
                        }
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveBankDetails} disabled={updateSetting.isPending} size="sm">
                        {updateSetting.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Bank Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* General Settings Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">General Settings</h2>
                    <p className="text-sm text-muted-foreground">Site configuration and statistics</p>
                  </div>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Setting
                </Button>
              </div>

              {settingsLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="pt-6 space-y-4">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : Object.keys(groupedSettings || {}).length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No general settings configured yet. Click "Add Setting" to create one.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedSettings || {}).map(([group, groupSettings]) => {
                    const GroupIcon = getGroupIcon(group);
                    return (
                      <Card key={group}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <GroupIcon className="w-4 h-4 text-primary" />
                            <CardTitle className="text-base">{getGroupTitle(group)}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {groupSettings?.map((setting) => (
                              <div key={setting.id} className="space-y-2">
                                <Label htmlFor={setting.id} className="text-sm">
                                  {formatSettingLabel(setting.setting_key)}
                                </Label>
                                <div className="flex gap-2">
                                  <Input
                                    id={setting.id}
                                    type={setting.setting_type === "number" ? "number" : "text"}
                                    value={editingSettings[setting.id] ?? setting.setting_value ?? ""}
                                    onChange={(e) => handleChange(setting.id, e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleSave(setting)}
                                    disabled={
                                      updateSetting.isPending ||
                                      editingSettings[setting.id] === undefined ||
                                      editingSettings[setting.id] === setting.setting_value
                                    }
                                  >
                                    {updateSetting.isPending ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Save className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Registration Forms Tab */}
          <TabsContent value="forms" className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Create and manage registration forms for course enrollment
              </p>
              <Button onClick={() => setIsFormModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Form
              </Button>
            </div>

            {formsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : registrationForms?.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-foreground mb-2">No registration forms</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a form to collect information during course enrollment
                  </p>
                  <Button onClick={() => setIsFormModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Form
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {registrationForms?.map((form: any) => (
                  <Card key={form.id} className="group hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{form.name}</CardTitle>
                          <CardDescription>
                            {form.course?.title || (form.course_type ? `All ${form.course_type.replace("_", "-")} courses` : "Global form")}
                          </CardDescription>
                        </div>
                        <Badge variant={form.is_active ? "default" : "secondary"}>
                          {form.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{form.fields?.length || 0} fields</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setEditingFormId(form.id)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeletingFormId(form.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Setting Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Setting</DialogTitle>
              <DialogDescription>
                Create a new site setting. Use underscores to group settings (e.g., site_name, stat_users).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSetting} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="setting_key">Setting Key</Label>
                <Input
                  id="setting_key"
                  placeholder="e.g., site_name or stat_learners"
                  value={newSetting.setting_key}
                  onChange={(e) => setNewSetting({ ...newSetting, setting_key: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setting_value">Value</Label>
                <Input
                  id="setting_value"
                  value={newSetting.setting_value}
                  onChange={(e) => setNewSetting({ ...newSetting, setting_value: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setting_type">Type</Label>
                <Select
                  value={newSetting.setting_type}
                  onValueChange={(v) => setNewSetting({ ...newSetting, setting_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this setting controls..."
                  value={newSetting.description}
                  onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                  rows={2}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createSetting.isPending}>
                  {createSetting.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Create Form Dialog */}
        <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Registration Form</DialogTitle>
              <DialogDescription>
                Create a new form to collect information during course enrollment.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateForm} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form_name">Form Name</Label>
                <Input
                  id="form_name"
                  placeholder="e.g., Basic Registration Form"
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Apply to Course (optional)</Label>
                <Select
                  value={newForm.course_id || "__all__"}
                  onValueChange={(v) => setNewForm({ ...newForm, course_id: v === "__all__" ? "" : v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course or leave empty for all" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All courses</SelectItem>
                    {courses?.map((course: any) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Or apply to course type</Label>
                <Select
                  value={newForm.course_type || "__any__"}
                  onValueChange={(v) => setNewForm({ ...newForm, course_type: v === "__any__" ? "" : v as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__any__">Any type</SelectItem>
                    <SelectItem value="cohort">Cohort-based courses</SelectItem>
                    <SelectItem value="self_paced">Self-paced courses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={newForm.is_active}
                  onCheckedChange={(checked) => setNewForm({ ...newForm, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createForm.isPending}>
                  {createForm.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Form
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Form Dialog */}
        <Dialog open={!!editingFormId} onOpenChange={(open) => !open && setEditingFormId(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Form Fields</DialogTitle>
              <DialogDescription>
                Drag to reorder fields. Click the chevron to expand and edit field details.
              </DialogDescription>
            </DialogHeader>
            <FormBuilder
              fields={formFields}
              onChange={setFormFields}
              onSave={handleSaveFields}
              isSaving={saveFields.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Form Confirmation */}
        <AlertDialog open={!!deletingFormId} onOpenChange={(open) => !open && setDeletingFormId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Registration Form</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this form? All fields will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteForm();
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                {deleteForm.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

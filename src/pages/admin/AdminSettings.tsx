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
  Eye,
  CreditCard,
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

  // Group settings by prefix
  const groupedSettings = settings?.reduce((acc, setting) => {
    const prefix = setting.setting_key.split("_")[0];
    if (!acc[prefix]) acc[prefix] = [];
    acc[prefix].push(setting);
    return acc;
  }, {} as Record<string, typeof settings>);

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
      case "payment":
        return CreditCard;
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
      case "payment":
        return "Payment Settings";
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
          <p className="text-muted-foreground">Configure site settings and registration forms</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" className="gap-2">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="forms" className="gap-2">
              <FileText className="w-4 h-4" />
              Registration Forms
            </TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Setting
              </Button>
            </div>

            {settingsLoading ? (
              <div className="space-y-6">
                {[...Array(2)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                  No settings configured yet. Click "Add Setting" to create one.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedSettings || {}).map(([group, groupSettings]) => {
                  const GroupIcon = getGroupIcon(group);
                  return (
                    <Card key={group}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <GroupIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle>{getGroupTitle(group)}</CardTitle>
                            <CardDescription>
                              Manage {group} related settings
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6 sm:grid-cols-2">
                          {groupSettings?.map((setting) => (
                            <div key={setting.id} className="space-y-2">
                              <Label htmlFor={setting.id}>
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
                              {setting.description && (
                                <p className="text-xs text-muted-foreground">{setting.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Registration Forms Tab */}
          <TabsContent value="forms" className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                Create and manage registration forms for course enrollment
              </p>
              <Button onClick={() => setIsFormModalOpen(true)} className="bg-primary hover:bg-primary/90">
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
                  placeholder="e.g., site_name or payment_bank_details"
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
                  value={newForm.course_id}
                  onValueChange={(v) => setNewForm({ ...newForm, course_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course or leave empty for all" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All courses</SelectItem>
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
                  value={newForm.course_type}
                  onValueChange={(v) => setNewForm({ ...newForm, course_type: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any type</SelectItem>
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
                onClick={handleDeleteForm}
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

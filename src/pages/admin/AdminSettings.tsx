import { useState } from "react";
import {
  Save,
  Plus,
  Loader2,
  Settings,
  Globe,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminSettings, useUpdateSetting, useCreateSetting } from "@/hooks/useAdminData";

export default function AdminSettings() {
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSetting, setNewSetting] = useState({
    setting_key: "",
    setting_value: "",
    setting_type: "text",
    description: "",
  });

  const { data: settings, isLoading } = useAdminSettings();
  const updateSetting = useUpdateSetting();
  const createSetting = useCreateSetting();

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

  const handleCreate = async (e: React.FormEvent) => {
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Configure site-wide settings</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Setting
          </Button>
        </div>

        {/* Settings Groups */}
        {isLoading ? (
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

        {/* Create Setting Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Setting</DialogTitle>
              <DialogDescription>
                Create a new site setting. Use underscores to group settings (e.g., site_name, stat_users).
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="setting_key">Setting Key</Label>
                <Input
                  id="setting_key"
                  placeholder="e.g., site_name or stat_total_users"
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
      </div>
    </AdminLayout>
  );
}

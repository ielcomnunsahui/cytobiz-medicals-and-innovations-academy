import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Upload,
  User,
  X,
  Linkedin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Facilitator = Tables<"facilitators">;

function useAdminFacilitators() {
  return useQuery({
    queryKey: ["admin-facilitators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilitators")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as Facilitator[];
    },
  });
}

function useCreateFacilitator() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (facilitator: { name: string; title?: string | null; bio?: string | null; expertise?: string[] | null; linkedin_url?: string | null; avatar_url?: string | null; display_order?: number }) => {
      const { data, error } = await supabase
        .from("facilitators")
        .insert(facilitator)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-facilitators"] });
      toast.success("Facilitator created successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to create facilitator: ${error.message}`);
    },
  });
}

function useUpdateFacilitator() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Facilitator> & { id: string }) => {
      const { data, error } = await supabase
        .from("facilitators")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-facilitators"] });
      toast.success("Facilitator updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update facilitator: ${error.message}`);
    },
  });
}

function useDeleteFacilitator() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("facilitators")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-facilitators"] });
      toast.success("Facilitator deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to delete facilitator: ${error.message}`);
    },
  });
}

export default function AdminFacilitators() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFacilitator, setEditingFacilitator] = useState<Facilitator | null>(null);
  const [deletingFacilitator, setDeletingFacilitator] = useState<Facilitator | null>(null);

  const { data: facilitators, isLoading } = useAdminFacilitators();
  const createFacilitator = useCreateFacilitator();
  const updateFacilitator = useUpdateFacilitator();
  const deleteFacilitator = useDeleteFacilitator();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    expertise: [] as string[],
    linkedin_url: "",
    avatar_url: "",
    display_order: 0,
  });
  const [expertiseInput, setExpertiseInput] = useState("");

  const filteredFacilitators = facilitators?.filter((facilitator) =>
    facilitator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facilitator.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facilitator.expertise?.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreate = () => {
    setFormData({
      name: "",
      title: "",
      bio: "",
      expertise: [],
      linkedin_url: "",
      avatar_url: "",
      display_order: (facilitators?.length || 0) + 1,
    });
    setExpertiseInput("");
    setIsCreateOpen(true);
  };

  const handleEdit = (facilitator: Facilitator) => {
    setFormData({
      name: facilitator.name,
      title: facilitator.title || "",
      bio: facilitator.bio || "",
      expertise: facilitator.expertise || [],
      linkedin_url: facilitator.linkedin_url || "",
      avatar_url: facilitator.avatar_url || "",
      display_order: facilitator.display_order || 0,
    });
    setExpertiseInput("");
    setEditingFacilitator(facilitator);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG, or WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `facilitators/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("testimonials")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("testimonials")
        .getPublicUrl(filePath);

      setFormData({ ...formData, avatar_url: publicUrl });
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddExpertise = () => {
    const trimmed = expertiseInput.trim();
    if (trimmed && !formData.expertise.includes(trimmed)) {
      setFormData({ ...formData, expertise: [...formData.expertise, trimmed] });
      setExpertiseInput("");
    }
  };

  const handleRemoveExpertise = (item: string) => {
    setFormData({ 
      ...formData, 
      expertise: formData.expertise.filter(e => e !== item) 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      title: formData.title || null,
      bio: formData.bio || null,
      expertise: formData.expertise.length > 0 ? formData.expertise : null,
      linkedin_url: formData.linkedin_url || null,
      avatar_url: formData.avatar_url || null,
      display_order: formData.display_order,
    };

    if (editingFacilitator) {
      await updateFacilitator.mutateAsync({ id: editingFacilitator.id, ...payload });
      setEditingFacilitator(null);
    } else {
      await createFacilitator.mutateAsync(payload);
      setIsCreateOpen(false);
    }
  };

  const handleDelete = async () => {
    if (deletingFacilitator) {
      await deleteFacilitator.mutateAsync(deletingFacilitator.id);
      setDeletingFacilitator(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Facilitators</h1>
            <p className="text-muted-foreground">Manage instructors and their profiles</p>
          </div>
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Facilitator
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, title, or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facilitator</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>LinkedIn</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredFacilitators?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No facilitators found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFacilitators?.map((facilitator) => (
                  <TableRow key={facilitator.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={facilitator.avatar_url || ""} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {facilitator.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{facilitator.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {facilitator.title || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {facilitator.expertise?.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {(facilitator.expertise?.length || 0) > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(facilitator.expertise?.length || 0) - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {facilitator.linkedin_url ? (
                        <a
                          href={facilitator.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <Linkedin className="w-4 h-4" />
                          <span className="text-sm">Profile</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(facilitator)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeletingFacilitator(facilitator)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Create/Edit Dialog */}
        <Dialog 
          open={isCreateOpen || !!editingFacilitator} 
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingFacilitator(null);
            }
          }}
        >
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFacilitator ? "Edit Facilitator" : "Add New Facilitator"}</DialogTitle>
              <DialogDescription>
                {editingFacilitator ? "Update the facilitator's profile." : "Add a new instructor to the platform."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={formData.avatar_url} />
                    <AvatarFallback className="bg-muted">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  {formData.avatar_url && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar_url: "" })}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP up to 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Health Educator"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="A brief introduction..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Expertise Areas</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Public Health"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddExpertise();
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddExpertise}>
                    Add
                  </Button>
                </div>
                {formData.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="pr-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveExpertise(skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  min={0}
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setIsCreateOpen(false); setEditingFacilitator(null); }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createFacilitator.isPending || updateFacilitator.isPending}
                >
                  {(createFacilitator.isPending || updateFacilitator.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingFacilitator ? "Save Changes" : "Add Facilitator"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingFacilitator} onOpenChange={(open) => !open && setDeletingFacilitator(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Facilitator</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingFacilitator?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteFacilitator.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

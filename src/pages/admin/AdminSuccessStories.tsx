import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  ExternalLink,
  Loader2,
  Quote,
  Users,
} from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  useAdminSuccessStories,
  useCreateSuccessStory,
  useUpdateSuccessStory,
  useDeleteSuccessStory,
  SuccessStory,
} from "@/hooks/useSuccessStories";

type StoryFormData = Omit<SuccessStory, "id" | "created_at" | "updated_at">;

const emptyForm: StoryFormData = {
  name: "",
  testimonial: "",
  title: "",
  company: "",
  image_url: "",
  linkedin_url: "",
  rating: 5,
  outcome: "",
  project_name: "",
  project_description: "",
  is_featured: false,
  is_active: true,
  display_order: 0,
};

export default function AdminSuccessStories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<StoryFormData>(emptyForm);

  const { data: stories, isLoading } = useAdminSuccessStories();
  const createStory = useCreateSuccessStory();
  const updateStory = useUpdateSuccessStory();
  const deleteStory = useDeleteSuccessStory();

  const handleOpenCreate = () => {
    setEditingStory(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (story: SuccessStory) => {
    setEditingStory(story);
    setFormData({
      name: story.name,
      testimonial: story.testimonial,
      title: story.title || "",
      company: story.company || "",
      image_url: story.image_url || "",
      linkedin_url: story.linkedin_url || "",
      rating: story.rating || 5,
      outcome: story.outcome || "",
      project_name: story.project_name || "",
      project_description: story.project_description || "",
      is_featured: story.is_featured || false,
      is_active: story.is_active ?? true,
      display_order: story.display_order || 0,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStory) {
      await updateStory.mutateAsync({ id: editingStory.id, ...formData });
    } else {
      await createStory.mutateAsync(formData);
    }
    setIsModalOpen(false);
    setEditingStory(null);
    setFormData(emptyForm);
  };

  const handleDelete = async () => {
    if (deletingId) {
      await deleteStory.mutateAsync(deletingId);
      setDeletingId(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" || name === "display_order" ? Number(value) : value,
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Success Stories</h1>
            <p className="text-muted-foreground">
              Manage testimonials and success stories displayed on the homepage
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Story
          </Button>
        </div>

        {/* Stories Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : stories && stories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {story.image_url ? (
                          <img
                            src={story.image_url}
                            alt={story.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <Users className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-base">{story.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {story.title}
                            {story.company && `, ${story.company}`}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenEdit(story)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setDeletingId(story.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: story.rating || 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-gold text-gold"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      "{story.testimonial}"
                    </p>
                    {story.outcome && (
                      <Badge variant="secondary" className="text-xs">
                        {story.outcome}
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 pt-2">
                      {story.is_active ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      {story.is_featured && (
                        <Badge className="bg-gold/20 text-gold border-gold/30">
                          Featured
                        </Badge>
                      )}
                      {story.linkedin_url && (
                        <a
                          href={story.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="py-16 text-center">
            <Quote className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No success stories yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your first success story to showcase on the homepage
            </p>
            <Button onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Add Story
            </Button>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStory ? "Edit Success Story" : "Add Success Story"}
            </DialogTitle>
            <DialogDescription>
              {editingStory
                ? "Update the testimonial details below"
                : "Add a new success story to display on the homepage"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Dr. Sarah Chen"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title/Role</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  placeholder="e.g., Founder, Director"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company || ""}
                  onChange={handleChange}
                  placeholder="e.g., RehabMind Ltd"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outcome">Key Outcome</Label>
                <Input
                  id="outcome"
                  name="outcome"
                  value={formData.outcome || ""}
                  onChange={handleChange}
                  placeholder="e.g., Founded RehabMind Ltd"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testimonial">Testimonial *</Label>
              <Textarea
                id="testimonial"
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                placeholder="The testimonial statement..."
                rows={4}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project_name">Project Name</Label>
                <Input
                  id="project_name"
                  name="project_name"
                  value={formData.project_name || ""}
                  onChange={handleChange}
                  placeholder="e.g., RehabMind"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project_description">Project Description</Label>
                <Input
                  id="project_description"
                  name="project_description"
                  value={formData.project_description || ""}
                  onChange={handleChange}
                  placeholder="Brief project description"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ImageUpload
                value={formData.image_url || ""}
                onChange={(url) =>
                  setFormData((prev) => ({ ...prev, image_url: url }))
                }
                label="Profile Image"
                placeholder="/testimonials/photo.jpg or https://..."
              />
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  value={formData.linkedin_url || ""}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min={1}
                  max={5}
                  value={formData.rating || 5}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  name="display_order"
                  type="number"
                  min={0}
                  value={formData.display_order || 0}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-4 pt-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active ?? true}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured || false}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_featured: checked }))
                    }
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createStory.isPending || updateStory.isPending}
              >
                {(createStory.isPending || updateStory.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingStory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Success Story</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this success story? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteStory.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

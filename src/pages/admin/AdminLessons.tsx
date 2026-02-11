import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Video,
  FileText,
  Link as LinkIcon,
  GripVertical,
  Save,
  X,
  Youtube,
  ExternalLink,
  File,
  Loader2,
  ClipboardCheck,
  ImagePlus,
  Package,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type LessonType = "text" | "video" | "document" | "external" | "scorm";

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  external_url: string | null;
  document_url: string | null;
  lesson_type: string | null;
  duration_minutes: number | null;
  order_index: number;
  is_free_preview: boolean | null;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: Lesson[];
}

const lessonTypeConfig = {
  text: { icon: FileText, label: "Text Content", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  video: { icon: Youtube, label: "YouTube Video", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  document: { icon: File, label: "Document/PDF", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  external: { icon: ExternalLink, label: "External Link", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  scorm: { icon: Package, label: "SCORM Package", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

export default function AdminLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);
  const [creatingForModule, setCreatingForModule] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [creatingModule, setCreatingModule] = useState(false);

  // Form state
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    lesson_type: "text" as LessonType,
    video_url: "",
    external_url: "",
    document_url: "",
    duration_minutes: "",
    is_free_preview: false,
  });

  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
  });

  // Image upload state
  const [lessonImages, setLessonImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    const newUrls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop();
        const path = `lessons/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from("lesson-images")
          .upload(path, file, { contentType: file.type });
        if (error) throw error;
        const { data: urlData } = supabase.storage
          .from("lesson-images")
          .getPublicUrl(path);
        newUrls.push(urlData.publicUrl);
      }
      setLessonImages((prev) => [...prev, ...newUrls]);
      toast.success(`${newUrls.length} image(s) uploaded`);
    } catch (err) {
      toast.error("Image upload failed: " + (err as Error).message);
    } finally {
      setUploadingImages(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const removeImage = (url: string) => {
    setLessonImages((prev) => prev.filter((u) => u !== url));
  };

  // Build content with embedded images
  const buildContentWithImages = (textContent: string, images: string[]) => {
    if (images.length === 0) return textContent;
    const imageBlock = images.map((url) => `![lesson-image](${url})`).join("\n");
    return textContent ? `${textContent}\n\n${imageBlock}` : imageBlock;
  };

  // Extract images from markdown content
  const extractImagesFromContent = (content: string): { text: string; images: string[] } => {
    const imageRegex = /!\[lesson-image\]\(([^)]+)\)/g;
    const images: string[] = [];
    let match;
    while ((match = imageRegex.exec(content)) !== null) {
      images.push(match[1]);
    }
    const text = content.replace(/\n*!\[lesson-image\]\([^)]+\)\n*/g, "").trim();
    return { text, images };
  };

  // Fetch course with modules and lessons
  const { data: course, isLoading } = useQuery({
    queryKey: ["admin-course-lessons", courseId],
    queryFn: async () => {
      if (!courseId) return null;

      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;

      const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select(`*, lessons (*)`)
        .eq("course_id", courseId)
        .order("order_index");

      if (modulesError) throw modulesError;

      return {
        ...courseData,
        modules: modules?.map((m) => ({
          ...m,
          lessons: m.lessons?.sort((a: Lesson, b: Lesson) => a.order_index - b.order_index) || [],
        })) || [],
      };
    },
    enabled: !!courseId,
  });

  // Create module mutation
  const createModule = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const maxOrder = course?.modules?.length || 0;
      const { error } = await supabase.from("modules").insert({
        course_id: courseId,
        title: data.title,
        description: data.description || null,
        order_index: maxOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-lessons"] });
      toast.success("Module created successfully");
      setCreatingModule(false);
      setModuleForm({ title: "", description: "" });
    },
    onError: (error) => {
      toast.error("Failed to create module: " + (error as Error).message);
    },
  });

  // Update module mutation
  const updateModule = useMutation({
    mutationFn: async (data: { id: string; title: string; description: string }) => {
      const { error } = await supabase
        .from("modules")
        .update({ title: data.title, description: data.description || null })
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-lessons"] });
      toast.success("Module updated successfully");
      setEditingModule(null);
    },
    onError: (error) => {
      toast.error("Failed to update module: " + (error as Error).message);
    },
  });

  // Delete module mutation
  const deleteModule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("modules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-lessons"] });
      toast.success("Module deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete module: " + (error as Error).message);
    },
  });

  // Create lesson mutation
  const createLesson = useMutation({
    mutationFn: async (data: { moduleId: string; form: typeof lessonForm }) => {
      const module = course?.modules?.find((m: Module) => m.id === data.moduleId);
      const maxOrder = module?.lessons?.length || 0;
      const finalContent = buildContentWithImages(data.form.content, lessonImages);

      const { error } = await supabase.from("lessons").insert({
        module_id: data.moduleId,
        title: data.form.title,
        content: finalContent || null,
        lesson_type: data.form.lesson_type,
        video_url: data.form.video_url || null,
        external_url: data.form.external_url || null,
        document_url: data.form.document_url || null,
        duration_minutes: data.form.duration_minutes ? parseInt(data.form.duration_minutes) : null,
        is_free_preview: data.form.is_free_preview,
        order_index: maxOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-lessons"] });
      toast.success("Lesson created successfully");
      setCreatingForModule(null);
      resetLessonForm();
    },
    onError: (error) => {
      toast.error("Failed to create lesson: " + (error as Error).message);
    },
  });

  // Update lesson mutation
  const updateLesson = useMutation({
    mutationFn: async (data: { id: string; form: typeof lessonForm }) => {
      const finalContent = buildContentWithImages(data.form.content, lessonImages);
      const { error } = await supabase
        .from("lessons")
        .update({
          title: data.form.title,
          content: finalContent || null,
          lesson_type: data.form.lesson_type,
          video_url: data.form.video_url || null,
          external_url: data.form.external_url || null,
          document_url: data.form.document_url || null,
          duration_minutes: data.form.duration_minutes ? parseInt(data.form.duration_minutes) : null,
          is_free_preview: data.form.is_free_preview,
        })
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-lessons"] });
      toast.success("Lesson updated successfully");
      setEditingLesson(null);
      resetLessonForm();
    },
    onError: (error) => {
      toast.error("Failed to update lesson: " + (error as Error).message);
    },
  });

  // Delete lesson mutation
  const deleteLesson = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("lessons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-lessons"] });
      toast.success("Lesson deleted successfully");
      setDeletingLesson(null);
    },
    onError: (error) => {
      toast.error("Failed to delete lesson: " + (error as Error).message);
    },
  });

  const resetLessonForm = () => {
    setLessonForm({
      title: "",
      content: "",
      lesson_type: "text",
      video_url: "",
      external_url: "",
      document_url: "",
      duration_minutes: "",
      is_free_preview: false,
    });
    setLessonImages([]);
  };

  const openEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    const { text, images } = extractImagesFromContent(lesson.content || "");
    setLessonImages(images);
    setLessonForm({
      title: lesson.title,
      content: text,
      lesson_type: (lesson.lesson_type as LessonType) || "text",
      video_url: lesson.video_url || "",
      external_url: lesson.external_url || "",
      document_url: lesson.document_url || "",
      duration_minutes: lesson.duration_minutes?.toString() || "",
      is_free_preview: lesson.is_free_preview || false,
    });
  };

  const openEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title,
      description: module.description || "",
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  if (!course) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">Course not found</h2>
          <Button onClick={() => navigate("/admin/courses")}>Back to Courses</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/courses")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Manage Lessons</h1>
            <p className="text-muted-foreground">{course.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/admin/courses/${courseId}/assessments`)}>
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Manage Assessments
            </Button>
            <Button onClick={() => setCreatingModule(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </div>
        </div>

        {/* Modules List */}
        {course.modules?.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No modules yet</h3>
            <p className="text-muted-foreground mb-4">Create your first module to start adding lessons</p>
            <Button onClick={() => setCreatingModule(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Module
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {course.modules?.map((module: Module, moduleIndex: number) => (
              <div key={module.id} className="border border-border rounded-xl bg-card overflow-hidden">
                {/* Module Header */}
                <div className="p-4 bg-muted/50 border-b border-border flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      Module {moduleIndex + 1}: {module.title}
                    </h3>
                    {module.description && (
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => openEditModule(module)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => deleteModule.mutate(module.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Lessons */}
                <div className="p-4 space-y-2">
                  {module.lessons?.map((lesson: Lesson, lessonIndex: number) => {
                    const typeConfig = lessonTypeConfig[lesson.lesson_type as keyof typeof lessonTypeConfig] || lessonTypeConfig.text;
                    const TypeIcon = typeConfig.icon;

                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <TypeIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{lesson.title}</span>
                            {lesson.is_free_preview && (
                              <Badge variant="outline" className="text-xs">Free Preview</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge className={cn("text-xs", typeConfig.color)}>
                              {typeConfig.label}
                            </Badge>
                            {lesson.duration_minutes && <span>{lesson.duration_minutes} min</span>}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => openEditLesson(lesson)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeletingLesson(lesson)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}

                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => {
                      setCreatingForModule(module.id);
                      resetLessonForm();
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lesson to {module.title}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Module Dialog */}
        <Dialog
          open={creatingModule || !!editingModule}
          onOpenChange={(open) => {
            if (!open) {
              setCreatingModule(false);
              setEditingModule(null);
              setModuleForm({ title: "", description: "" });
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingModule ? "Edit Module" : "Create Module"}</DialogTitle>
              <DialogDescription>
                {editingModule ? "Update the module details" : "Add a new module to organize your lessons"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="e.g., Introduction to the Course"
                />
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  placeholder="Brief description of this module"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCreatingModule(false);
                  setEditingModule(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (editingModule) {
                    updateModule.mutate({ id: editingModule.id, ...moduleForm });
                  } else {
                    createModule.mutate(moduleForm);
                  }
                }}
                disabled={!moduleForm.title || createModule.isPending || updateModule.isPending}
              >
                {(createModule.isPending || updateModule.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingModule ? "Update Module" : "Create Module"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create/Edit Lesson Dialog */}
        <Dialog
          open={!!creatingForModule || !!editingLesson}
          onOpenChange={(open) => {
            if (!open) {
              setCreatingForModule(null);
              setEditingLesson(null);
              resetLessonForm();
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLesson ? "Edit Lesson" : "Create Lesson"}</DialogTitle>
              <DialogDescription>
                {editingLesson ? "Update the lesson content and settings" : "Add a new lesson to the module"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="e.g., Getting Started"
                />
              </div>

              <div className="space-y-2">
                <Label>Lesson Type</Label>
                <Select
                  value={lessonForm.lesson_type}
                  onValueChange={(value: LessonType) => setLessonForm({ ...lessonForm, lesson_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Text Content
                      </div>
                    </SelectItem>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Youtube className="w-4 h-4" />
                        YouTube Video
                      </div>
                    </SelectItem>
                    <SelectItem value="document">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        Document/PDF
                      </div>
                    </SelectItem>
                    <SelectItem value="external">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        External Link
                      </div>
                    </SelectItem>
                    <SelectItem value="scorm">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        SCORM Package
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {lessonForm.lesson_type === "video" && (
                <div className="space-y-2">
                  <Label>YouTube URL</Label>
                  <Input
                    value={lessonForm.video_url}
                    onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste a YouTube video URL. It will be embedded in the lesson.
                  </p>
                </div>
              )}

              {lessonForm.lesson_type === "document" && (
                <div className="space-y-2">
                  <Label>Document URL</Label>
                  <Input
                    value={lessonForm.document_url}
                    onChange={(e) => setLessonForm({ ...lessonForm, document_url: e.target.value })}
                    placeholder="https://example.com/document.pdf"
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to a PDF or document file
                  </p>
                </div>
              )}

              {lessonForm.lesson_type === "external" && (
                <div className="space-y-2">
                  <Label>External URL</Label>
                  <Input
                    value={lessonForm.external_url}
                    onChange={(e) => setLessonForm({ ...lessonForm, external_url: e.target.value })}
                    placeholder="https://external-resource.com/lesson"
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to external learning resource
                  </p>
                </div>
              )}

              {lessonForm.lesson_type === "scorm" && (
                <div className="space-y-2">
                  <Label>SCORM Package URL</Label>
                  <Input
                    value={lessonForm.external_url}
                    onChange={(e) => setLessonForm({ ...lessonForm, external_url: e.target.value })}
                    placeholder="https://your-scorm-host.com/package/index.html"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL to the SCORM package launch page. The package will be loaded in an iframe.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                  placeholder="Write your lesson content here..."
                  rows={8}
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>Lesson Images</Label>
                <div className="border border-dashed border-border rounded-lg p-4 space-y-3">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploadingImages}
                  >
                    {uploadingImages ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ImagePlus className="w-4 h-4 mr-2" />
                    )}
                    {uploadingImages ? "Uploading..." : "Add Images"}
                  </Button>
                  {lessonImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {lessonImages.map((url, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-border">
                          <img src={url} alt={`Lesson image ${idx + 1}`} className="w-full h-24 object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Upload one or more images to display alongside the lesson content.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={lessonForm.duration_minutes}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: e.target.value })}
                    placeholder="15"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <Label>Free Preview</Label>
                    <p className="text-xs text-muted-foreground">Allow non-enrolled users to view</p>
                  </div>
                  <Switch
                    checked={lessonForm.is_free_preview}
                    onCheckedChange={(checked) =>
                      setLessonForm({ ...lessonForm, is_free_preview: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCreatingForModule(null);
                  setEditingLesson(null);
                  resetLessonForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (editingLesson) {
                    updateLesson.mutate({ id: editingLesson.id, form: lessonForm });
                  } else if (creatingForModule) {
                    createLesson.mutate({ moduleId: creatingForModule, form: lessonForm });
                  }
                }}
                disabled={!lessonForm.title || createLesson.isPending || updateLesson.isPending}
              >
                {(createLesson.isPending || updateLesson.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                <Save className="w-4 h-4 mr-2" />
                {editingLesson ? "Update Lesson" : "Create Lesson"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Lesson Confirmation */}
        <AlertDialog open={!!deletingLesson} onOpenChange={(open) => !open && setDeletingLesson(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingLesson?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingLesson && deleteLesson.mutate(deletingLesson.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteLesson.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

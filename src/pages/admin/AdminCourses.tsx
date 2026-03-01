import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Upload,
  ImageIcon,
  X,
  Percent,
  CheckSquare,
  ClipboardCheck,
  BookOpen,
  BarChart3,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CourseAccessSettingsForm, CourseAccessFormData } from "@/components/admin/CourseAccessSettingsForm";
import { useAdminCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from "@/hooks/useAdminData";
import { useUpdateCourseAccessSettings } from "@/hooks/useCourseAccess";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminCourses() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [deletingCourse, setDeletingCourse] = useState<any>(null);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [isBulkPriceOpen, setIsBulkPriceOpen] = useState(false);
  const [bulkDiscountPercent, setBulkDiscountPercent] = useState(10);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const { data: courses, isLoading } = useAdminCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const updateAccessSettings = useUpdateCourseAccessSettings();

  // Access settings state for new courses
  const [accessSettings, setAccessSettings] = useState<CourseAccessFormData>({
    content_access: 'free',
    assessment_access: 'free',
    certificate_access: 'paid',
    certificate_fee: 5000,
    promo_enabled: false,
    promo_expiry: null,
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    course_type: "self_paced" as "cohort" | "self_paced",
    status: "draft" as "draft" | "published" | "archived",
    level: "beginner",
    price: 0,
    original_price: null as number | null,
    discounted_price: null as number | null,
    duration_hours: 8,
    effort_hours_per_week: 4,
    category: "",
    thumbnail_url: "",
    enrollment_deadline: "",
  });

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    const matchesType = typeFilter === "all" || course.course_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>;
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleCreate = () => {
    setFormData({
      title: "",
      slug: "",
      short_description: "",
      description: "",
      course_type: "self_paced",
      status: "draft",
      level: "beginner",
      price: 0,
      original_price: null,
      discounted_price: null,
      duration_hours: 8,
      effort_hours_per_week: 4,
      category: "",
      thumbnail_url: "",
      enrollment_deadline: "",
    });
    setAccessSettings({
      content_access: 'free',
      assessment_access: 'free',
      certificate_access: 'paid',
      certificate_fee: 5000,
      promo_enabled: false,
      promo_expiry: null,
    });
    setIsCreateOpen(true);
  };

  const handleEdit = (course: any) => {
    setFormData({
      title: course.title,
      slug: course.slug,
      short_description: course.short_description || "",
      description: course.description || "",
      course_type: course.course_type,
      status: course.status,
      level: course.level || "beginner",
      price: course.price || 0,
      original_price: course.original_price ?? null,
      discounted_price: course.discounted_price ?? null,
      duration_hours: course.duration_hours || 8,
      effort_hours_per_week: course.effort_hours_per_week || 4,
      category: course.category || "",
      thumbnail_url: course.thumbnail_url || "",
      enrollment_deadline: course.enrollment_deadline ? course.enrollment_deadline.slice(0, 16) : "",
    });
    setEditingCourse(course);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `courses/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("course-thumbnails")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("course-thumbnails")
        .getPublicUrl(filePath);

      setFormData({ ...formData, thumbnail_url: publicUrl });
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, thumbnail_url: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      enrollment_deadline: formData.enrollment_deadline ? new Date(formData.enrollment_deadline).toISOString() : null,
    };
    if (editingCourse) {
      await updateCourse.mutateAsync({ id: editingCourse.id, ...submitData });
      setEditingCourse(null);
    } else {
      await createCourse.mutateAsync(submitData);
      setIsCreateOpen(false);
    }
  };

  const handleDelete = async () => {
    if (deletingCourse) {
      await deleteCourse.mutateAsync(deletingCourse.id);
      setDeletingCourse(null);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSelectCourse = (courseId: string, checked: boolean) => {
    const newSelected = new Set(selectedCourses);
    if (checked) {
      newSelected.add(courseId);
    } else {
      newSelected.delete(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && filteredCourses) {
      setSelectedCourses(new Set(filteredCourses.map(c => c.id)));
    } else {
      setSelectedCourses(new Set());
    }
  };

  const handleBulkApplyDiscount = async () => {
    if (selectedCourses.size === 0) return;
    
    setIsBulkUpdating(true);
    try {
      const selectedCoursesList = courses?.filter(c => selectedCourses.has(c.id)) || [];
      
      for (const course of selectedCoursesList) {
        const originalPrice = course.original_price || course.price || 0;
        if (originalPrice > 0) {
          const discountedPrice = Math.round(originalPrice * (1 - bulkDiscountPercent / 100));
          await updateCourse.mutateAsync({
            id: course.id,
            original_price: originalPrice,
            discounted_price: discountedPrice,
          });
        }
      }
      
      toast.success(`Applied ${bulkDiscountPercent}% discount to ${selectedCourses.size} course(s)`);
      setSelectedCourses(new Set());
      setIsBulkPriceOpen(false);
    } catch (error: any) {
      toast.error(`Failed to apply discount: ${error.message}`);
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleBulkRemoveDiscount = async () => {
    if (selectedCourses.size === 0) return;
    
    setIsBulkUpdating(true);
    try {
      for (const courseId of selectedCourses) {
        await updateCourse.mutateAsync({
          id: courseId,
          discounted_price: null,
        });
      }
      
      toast.success(`Removed discount from ${selectedCourses.size} course(s)`);
      setSelectedCourses(new Set());
      setIsBulkPriceOpen(false);
    } catch (error: any) {
      toast.error(`Failed to remove discount: ${error.message}`);
    } finally {
      setIsBulkUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Courses</h1>
            <p className="text-muted-foreground">Manage your course catalog</p>
          </div>
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cohort">Cohort</SelectItem>
              <SelectItem value="self_paced">Self-Paced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions Bar */}
        {selectedCourses.size > 0 && (
          <div className="flex items-center gap-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <CheckSquare className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">{selectedCourses.size} course(s) selected</span>
            <div className="flex-1" />
            <Button size="sm" variant="outline" onClick={() => setSelectedCourses(new Set())}>
              Clear Selection
            </Button>
            <Button size="sm" onClick={() => setIsBulkPriceOpen(true)}>
              <Percent className="w-4 h-4 mr-2" />
              Apply Discount
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={filteredCourses?.length ? selectedCourses.size === filteredCourses.length : false}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-14 rounded" />
                        <Skeleton className="h-5 w-40" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCourses?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No courses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses?.map((course) => (
                  <TableRow key={course.id} className={selectedCourses.has(course.id) ? "bg-primary/5" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCourses.has(course.id)}
                        onCheckedChange={(checked) => handleSelectCourse(course.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                          {course.thumbnail_url ? (
                            <img
                              src={course.thumbnail_url}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium truncate max-w-[200px]">{course.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {course.course_type.replace("_", "-")}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(course.status)}</TableCell>
                    <TableCell>{course.enrollmentCount}</TableCell>
                    <TableCell>
                      {course.discounted_price !== null ? (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground line-through text-sm">
                            ₦{(course.original_price || 0).toLocaleString()}
                          </span>
                          <span className="font-medium text-primary">
                            ₦{course.discounted_price.toLocaleString()}
                          </span>
                        </div>
                      ) : course.original_price ? (
                        <span>₦{course.original_price.toLocaleString()}</span>
                      ) : course.price ? (
                        <span>₦{course.price.toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground">Free</span>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(course.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/courses/${course.slug}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(course)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/courses/${course.id}/lessons`}>
                              <BookOpen className="w-4 h-4 mr-2" />
                              Manage Lessons
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/courses/${course.id}/assessments`}>
                              <ClipboardCheck className="w-4 h-4 mr-2" />
                              Manage Assessments
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => setDeletingCourse(course)}
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
        <Dialog open={isCreateOpen || !!editingCourse} onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingCourse(null);
          }
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? "Edit Course" : "Create New Course"}</DialogTitle>
              <DialogDescription>
                {editingCourse ? "Update the course details below." : "Fill in the details to create a new course."}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Course Details</TabsTrigger>
                <TabsTrigger value="access" className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  Access Settings
                </TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit}>
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ 
                            ...formData, 
                            title: e.target.value,
                            slug: !editingCourse ? generateSlug(e.target.value) : formData.slug
                          });
                        }}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  {/* Course Thumbnail Upload */}
                  <div className="space-y-2">
                    <Label>Course Thumbnail</Label>
                    <div className="flex items-start gap-4">
                      {formData.thumbnail_url ? (
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-border">
                          <img
                            src={formData.thumbnail_url}
                            alt="Course thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30">
                          <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
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
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Image
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG, WebP or GIF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="course_type">Course Type</Label>
                      <Select 
                        value={formData.course_type} 
                        onValueChange={(v) => setFormData({ ...formData, course_type: v as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self_paced">Self-Paced</SelectItem>
                          <SelectItem value="cohort">Cohort</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(v) => setFormData({ ...formData, status: v as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="original_price">Original Price (₦)</Label>
                      <Input
                        id="original_price"
                        type="number"
                        min="0"
                        placeholder="e.g., 50000"
                        value={formData.original_price ?? ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          original_price: e.target.value ? Number(e.target.value) : null,
                          price: e.target.value ? Number(e.target.value) : formData.price
                        })}
                      />
                      <p className="text-xs text-muted-foreground">Slashed/standard price</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discounted_price">Discounted Price (₦)</Label>
                      <Input
                        id="discounted_price"
                        type="number"
                        min="0"
                        placeholder="e.g., 25000"
                        value={formData.discounted_price ?? ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          discounted_price: e.target.value ? Number(e.target.value) : null 
                        })}
                      />
                      <p className="text-xs text-muted-foreground">Leave empty for no discount</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select 
                        value={formData.level} 
                        onValueChange={(v) => setFormData({ ...formData, level: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration_hours">Duration (hours)</Label>
                      <Input
                        id="duration_hours"
                        type="number"
                        min="1"
                        value={formData.duration_hours}
                        onChange={(e) => setFormData({ ...formData, duration_hours: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="effort_hours_per_week">Effort (hours/week)</Label>
                      <Input
                        id="effort_hours_per_week"
                        type="number"
                        min="1"
                        value={formData.effort_hours_per_week}
                        onChange={(e) => setFormData({ ...formData, effort_hours_per_week: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="enrollment_deadline">Enrollment Deadline</Label>
                      <Input
                        id="enrollment_deadline"
                        type="datetime-local"
                        value={formData.enrollment_deadline}
                        onChange={(e) => setFormData({ ...formData, enrollment_deadline: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">When enrollment closes (leave empty for no deadline)</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="access" className="space-y-4 mt-4">
                  <div className="bg-muted/30 rounded-lg p-4 border">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Settings2 className="w-4 h-4" />
                      Access Control Configuration
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure how learners access content, assessments, and certificates for this course.
                    </p>
                    
                    {editingCourse ? (
                      <CourseAccessSettingsForm 
                        courseId={editingCourse.id} 
                        embedded={true}
                        onChange={(settings) => setAccessSettings(settings)}
                      />
                    ) : (
                      <CourseAccessSettingsForm 
                        courseId="new" 
                        embedded={true}
                        onChange={(settings) => setAccessSettings(settings)}
                      />
                    )}
                  </div>
                </TabsContent>

                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsCreateOpen(false);
                    setEditingCourse(null);
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createCourse.isPending || updateCourse.isPending}>
                    {(createCourse.isPending || updateCourse.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingCourse ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingCourse} onOpenChange={(open) => !open && setDeletingCourse(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Course</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingCourse?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteCourse.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Price Update Dialog */}
        <Dialog open={isBulkPriceOpen} onOpenChange={setIsBulkPriceOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Price Update</DialogTitle>
              <DialogDescription>
                Apply a discount to {selectedCourses.size} selected course(s).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Discount Percentage</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={bulkDiscountPercent}
                    onChange={(e) => setBulkDiscountPercent(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-muted-foreground">%</span>
                  <div className="flex gap-2">
                    {[10, 20, 30, 50].map((pct) => (
                      <Button
                        key={pct}
                        type="button"
                        variant={bulkDiscountPercent === pct ? "default" : "outline"}
                        size="sm"
                        onClick={() => setBulkDiscountPercent(pct)}
                      >
                        {pct}%
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBulkRemoveDiscount}
                disabled={isBulkUpdating}
              >
                Remove Discounts
              </Button>
              <Button
                onClick={handleBulkApplyDiscount}
                disabled={isBulkUpdating}
              >
                {isBulkUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Apply {bulkDiscountPercent}% Discount
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

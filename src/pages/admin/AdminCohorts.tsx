import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Users,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCohorts, useCreateCohort, useUpdateCohort, useDeleteCohort, CohortWithCourse } from "@/hooks/useCohorts";
import { useAdminCourses } from "@/hooks/useAdminData";
import { format, differenceInDays, isPast, isFuture } from "date-fns";

export default function AdminCohorts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCohort, setEditingCohort] = useState<CohortWithCourse | null>(null);
  const [deletingCohort, setDeletingCohort] = useState<CohortWithCourse | null>(null);

  const { data: cohorts, isLoading } = useCohorts();
  const { data: courses } = useAdminCourses();
  const createCohort = useCreateCohort();
  const updateCohort = useUpdateCohort();
  const deleteCohort = useDeleteCohort();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    course_id: "",
    start_date: "",
    end_date: "",
    application_deadline: "",
    max_students: 50,
    is_active: true,
  });

  const filteredCohorts = cohorts?.filter((cohort) => {
    const matchesSearch = 
      cohort.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cohort.course?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === "all" || cohort.course_id === courseFilter;
    
    let matchesStatus = true;
    if (statusFilter === "active") matchesStatus = cohort.is_active === true;
    if (statusFilter === "inactive") matchesStatus = cohort.is_active === false;
    if (statusFilter === "upcoming") matchesStatus = isFuture(new Date(cohort.start_date));
    if (statusFilter === "ongoing") {
      const now = new Date();
      matchesStatus = new Date(cohort.start_date) <= now && new Date(cohort.end_date) >= now;
    }
    if (statusFilter === "completed") matchesStatus = isPast(new Date(cohort.end_date));

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getCohortStatus = (cohort: CohortWithCourse) => {
    const now = new Date();
    const startDate = new Date(cohort.start_date);
    const endDate = new Date(cohort.end_date);

    if (!cohort.is_active) {
      return <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>;
    }
    if (isPast(endDate)) {
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Completed</Badge>;
    }
    if (isFuture(startDate)) {
      const daysUntil = differenceInDays(startDate, now);
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Starts in {daysUntil} days</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Ongoing</Badge>;
  };

  const getDeadlineStatus = (deadline: string | null) => {
    if (!deadline) return <span className="text-muted-foreground">No deadline</span>;
    
    const deadlineDate = new Date(deadline);
    if (isPast(deadlineDate)) {
      return <span className="text-destructive">Deadline passed</span>;
    }
    const daysLeft = differenceInDays(deadlineDate, new Date());
    if (daysLeft <= 3) {
      return <span className="text-orange-600 dark:text-orange-400">{daysLeft} days left</span>;
    }
    return <span className="text-muted-foreground">{format(deadlineDate, "MMM d, yyyy")}</span>;
  };

  const handleCreate = () => {
    setFormData({
      title: "",
      course_id: "",
      start_date: "",
      end_date: "",
      application_deadline: "",
      max_students: 50,
      is_active: true,
    });
    setIsCreateOpen(true);
  };

  const handleEdit = (cohort: CohortWithCourse) => {
    setFormData({
      title: cohort.title,
      course_id: cohort.course_id,
      start_date: cohort.start_date,
      end_date: cohort.end_date,
      application_deadline: cohort.application_deadline ? new Date(cohort.application_deadline).toISOString().slice(0, 16) : "",
      max_students: cohort.max_students || 50,
      is_active: cohort.is_active ?? true,
    });
    setEditingCohort(cohort);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      title: formData.title,
      course_id: formData.course_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      application_deadline: formData.application_deadline || null,
      max_students: formData.max_students,
      is_active: formData.is_active,
    };

    if (editingCohort) {
      await updateCohort.mutateAsync({ id: editingCohort.id, ...payload });
      setEditingCohort(null);
    } else {
      await createCohort.mutateAsync(payload);
      setIsCreateOpen(false);
    }
  };

  const handleDelete = async () => {
    if (deletingCohort) {
      await deleteCohort.mutateAsync(deletingCohort.id);
      setDeletingCohort(null);
    }
  };

  // Get cohort courses only
  const cohortCourses = courses?.filter(c => c.course_type === "cohort");

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cohorts</h1>
            <p className="text-muted-foreground">Manage course cohorts and application deadlines</p>
          </div>
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Cohort
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cohorts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {cohortCourses?.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border border-border rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cohort</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Application Deadline</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCohorts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No cohorts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCohorts?.map((cohort) => (
                  <TableRow key={cohort.id}>
                    <TableCell className="font-medium">{cohort.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {cohort.course?.title || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {format(new Date(cohort.start_date), "MMM d")} - {format(new Date(cohort.end_date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {getDeadlineStatus(cohort.application_deadline)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{cohort.max_students || "∞"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getCohortStatus(cohort)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(cohort)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => setDeletingCohort(cohort)}
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
          open={isCreateOpen || !!editingCohort} 
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingCohort(null);
            }
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCohort ? "Edit Cohort" : "Create New Cohort"}</DialogTitle>
              <DialogDescription>
                {editingCohort ? "Update the cohort details below." : "Set up a new cohort for a course."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Cohort Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., HIC: Cohort 4"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select 
                  value={formData.course_id} 
                  onValueChange={(value) => setFormData({ ...formData, course_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {cohortCourses?.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="application_deadline">Application Deadline</Label>
                <Input
                  id="application_deadline"
                  type="datetime-local"
                  value={formData.application_deadline}
                  onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for no deadline. This controls the countdown shown to learners.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_students">Maximum Students</Label>
                <Input
                  id="max_students"
                  type="number"
                  min={1}
                  value={formData.max_students}
                  onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 50 })}
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label htmlFor="is_active">Active</Label>
                  <p className="text-xs text-muted-foreground">Allow enrollments for this cohort</p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => { setIsCreateOpen(false); setEditingCohort(null); }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createCohort.isPending || updateCohort.isPending}
                >
                  {(createCohort.isPending || updateCohort.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingCohort ? "Save Changes" : "Create Cohort"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingCohort} onOpenChange={(open) => !open && setDeletingCohort(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Cohort</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingCohort?.title}"? This action cannot be undone.
                Any associated enrollments may be affected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteCohort.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

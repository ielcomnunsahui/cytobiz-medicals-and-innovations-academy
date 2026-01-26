import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Loader2,
  UserCheck,
  Lock,
  Unlock,
  BookOpen,
  Award,
  ClipboardCheck,
  Filter,
  Download,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminCourses } from "@/hooks/useAdminData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCreateAccessUnlock } from "@/hooks/useCourseAccess";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminUserAccessUnlocks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("__all__");
  const [typeFilter, setTypeFilter] = useState("__all__");
  const [isUnlockOpen, setIsUnlockOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [unlockType, setUnlockType] = useState<"content" | "assessment" | "certificate">("certificate");
  const [reason, setReason] = useState("");
  
  const { data: courses } = useAdminCourses();
  const createUnlock = useCreateAccessUnlock();
  const queryClient = useQueryClient();

  // Fetch all access unlocks with related data
  const { data: unlocks, isLoading } = useQuery({
    queryKey: ["admin-access-unlocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("access_unlocks")
        .select(`
          *,
          course:courses(id, title, slug),
          cohort:cohorts(id, title),
          user_profile:profiles!access_unlocks_user_id_fkey(user_id, display_name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch all enrolled users for quick unlock
  const { data: enrollments } = useQuery({
    queryKey: ["admin-all-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          user_id,
          course_id,
          profiles!inner(user_id, display_name),
          course:courses(id, title)
        `);
      
      if (error) throw error;
      return data;
    },
  });

  const filteredUnlocks = unlocks?.filter((unlock) => {
    const userName = (unlock.user_profile as any)?.display_name || '';
    const courseName = (unlock.course as any)?.title || '';
    const matchesSearch = 
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === "__all__" || unlock.course_id === courseFilter;
    const matchesType = typeFilter === "__all__" || unlock.unlock_type === typeFilter;
    return matchesSearch && matchesCourse && matchesType;
  });

  const getUnlockTypeBadge = (type: string) => {
    switch (type) {
      case "content":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><BookOpen className="w-3 h-3 mr-1" /> Content</Badge>;
      case "assessment":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200"><ClipboardCheck className="w-3 h-3 mr-1" /> Assessment</Badge>;
      case "certificate":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Award className="w-3 h-3 mr-1" /> Certificate</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleQuickUnlock = async () => {
    if (!selectedUserId || !selectedCourse) {
      toast.error("Please select a user and course");
      return;
    }

    try {
      await createUnlock.mutateAsync({
        userId: selectedUserId,
        courseId: selectedCourse,
        unlockType,
        reason: reason || undefined,
      });
      
      toast.success("Access unlocked successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-access-unlocks"] });
      setIsUnlockOpen(false);
      setSelectedUserId("");
      setSelectedCourse("");
      setReason("");
    } catch (error: any) {
      toast.error(`Failed to unlock: ${error.message}`);
    }
  };

  const uniqueEnrollments = enrollments?.reduce((acc, enrollment) => {
    const key = `${enrollment.user_id}-${enrollment.course_id}`;
    if (!acc.find(e => `${e.user_id}-${e.course_id}` === key)) {
      acc.push(enrollment);
    }
    return acc;
  }, [] as typeof enrollments) || [];

  const filteredEnrollmentsForCourse = selectedCourse 
    ? uniqueEnrollments.filter(e => e.course_id === selectedCourse)
    : uniqueEnrollments;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold">Access Unlocks</h1>
            <p className="text-muted-foreground">
              Manually grant access to content, assessments, or certificates
            </p>
          </div>
          <Button onClick={() => setIsUnlockOpen(true)}>
            <Unlock className="w-4 h-4 mr-2" />
            Grant Access
          </Button>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users or courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Courses</SelectItem>
              {courses?.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Types</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="assessment">Assessment</SelectItem>
              <SelectItem value="certificate">Certificate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold">{unlocks?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Total Unlocks</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {unlocks?.filter(u => u.unlock_type === 'content').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Content Unlocks</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {unlocks?.filter(u => u.unlock_type === 'assessment').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Assessment Unlocks</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-amber-600">
              {unlocks?.filter(u => u.unlock_type === 'certificate').length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Certificate Unlocks</div>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredUnlocks && filteredUnlocks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Access Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Unlocked At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnlocks.map((unlock) => (
                  <TableRow key={unlock.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-muted-foreground" />
                        {(unlock.user_profile as any)?.display_name || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell>{(unlock.course as any)?.title || 'Unknown'}</TableCell>
                    <TableCell>{getUnlockTypeBadge(unlock.unlock_type)}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {unlock.reason || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(unlock.created_at), "MMM d, yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No access unlocks found</p>
              <p className="text-sm">Manual unlocks will appear here</p>
            </div>
          )}
        </div>

        {/* Quick Unlock Dialog */}
        <Dialog open={isUnlockOpen} onOpenChange={setIsUnlockOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Unlock className="w-5 h-5" />
                Grant Manual Access
              </DialogTitle>
              <DialogDescription>
                Manually unlock access for a specific user and course
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Course Selection */}
              <div className="space-y-2">
                <Label>Course</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* User Selection */}
              <div className="space-y-2">
                <Label>User (Enrolled)</Label>
                <Select 
                  value={selectedUserId} 
                  onValueChange={setSelectedUserId}
                  disabled={!selectedCourse}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedCourse ? "Select a user" : "Select course first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEnrollmentsForCourse.map((enrollment) => (
                      <SelectItem key={enrollment.user_id} value={enrollment.user_id}>
                        {(enrollment.profiles as any)?.display_name || 'Unknown User'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Unlock Type */}
              <div className="space-y-2">
                <Label>Access Type</Label>
                <Select 
                  value={unlockType} 
                  onValueChange={(v) => setUnlockType(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        Content Access
                      </div>
                    </SelectItem>
                    <SelectItem value="assessment">
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-purple-600" />
                        Assessment Access
                      </div>
                    </SelectItem>
                    <SelectItem value="certificate">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600" />
                        Certificate Access
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label>Reason (for audit log)</Label>
                <Textarea
                  placeholder="Enter reason for manual unlock..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUnlockOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleQuickUnlock} 
                disabled={!selectedUserId || !selectedCourse || createUnlock.isPending}
              >
                {createUnlock.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Grant Access
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

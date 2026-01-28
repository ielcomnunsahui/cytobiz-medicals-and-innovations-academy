import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Lock, 
  Unlock, 
  BookOpen, 
  Award, 
  ClipboardCheck, 
  Loader2,
  Search,
  UserCheck,
  History,
  Plus,
  Users
} from "lucide-react";
import { BulkUnlockDialog } from "./BulkUnlockDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCreateAccessUnlock } from "@/hooks/useCourseAccess";
import { toast } from "sonner";
import { format } from "date-fns";

interface AdminUnlockControlsProps {
  courseId: string;
  courseName: string;
  cohortId?: string;
}

interface UserWithProfile {
  id: string;
  email: string;
  display_name: string | null;
}

export function AdminUnlockControls({ courseId, courseName, cohortId }: AdminUnlockControlsProps) {
  const [isUnlockOpen, setIsUnlockOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const [unlockType, setUnlockType] = useState<"content" | "assessment" | "certificate">("certificate");
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const createUnlock = useCreateAccessUnlock();

  // Fetch enrolled users for this course
  const { data: enrolledUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["enrolled-users", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          user_id,
          profiles!inner(user_id, display_name)
        `)
        .eq("course_id", courseId);
      
      if (error) throw error;
      
      // Get user emails from auth (admin only)
      const userIds = data?.map(e => e.user_id) || [];
      
      // Return the enrolled users with their profile data
      return data?.map(enrollment => ({
        id: enrollment.user_id,
        display_name: (enrollment.profiles as any)?.display_name || 'Unknown User',
        email: 'N/A' // Email not accessible without service role
      })) || [];
    },
    enabled: !!courseId,
  });

  // Fetch existing unlocks for this course
  const { data: existingUnlocks, isLoading: unlocksLoading } = useQuery({
    queryKey: ["course-unlocks", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("access_unlocks")
        .select(`
          *,
          profiles:user_id(display_name)
        `)
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  const filteredUsers = enrolledUsers?.filter(user =>
    user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleUnlock = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    try {
      await createUnlock.mutateAsync({
        userId: selectedUser.id,
        courseId,
        cohortId,
        unlockType,
        reason: reason || undefined,
      });
      
      toast.success(`${unlockType.charAt(0).toUpperCase() + unlockType.slice(1)} access unlocked for ${selectedUser.display_name}`);
      queryClient.invalidateQueries({ queryKey: ["course-unlocks", courseId] });
      setIsUnlockOpen(false);
      setSelectedUser(null);
      setReason("");
    } catch (error: any) {
      toast.error(`Failed to unlock: ${error.message}`);
    }
  };

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Manual Access Unlocks
            </CardTitle>
            <CardDescription>
              Grant manual access to content, assessments, or certificates for specific users
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsBulkOpen(true)} variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Bulk Unlock
            </Button>
            <Button onClick={() => setIsUnlockOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Grant Access
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Existing Unlocks History */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <History className="w-4 h-4" />
            <span>Unlock History</span>
          </div>
          
          {unlocksLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : existingUnlocks && existingUnlocks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Access Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Unlocked At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {existingUnlocks.map((unlock) => (
                  <TableRow key={unlock.id}>
                    <TableCell className="font-medium">
                      {(unlock.profiles as any)?.display_name || 'Unknown'}
                    </TableCell>
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
            <div className="text-center py-8 text-muted-foreground">
              No manual unlocks have been granted yet
            </div>
          )}
        </div>
      </CardContent>

      {/* Unlock Dialog */}
      <Dialog open={isUnlockOpen} onOpenChange={setIsUnlockOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Unlock className="w-5 h-5" />
              Grant Manual Access
            </DialogTitle>
            <DialogDescription>
              Manually unlock access for a user on "{courseName}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* User Search */}
            <div className="space-y-2">
              <Label>Select User</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search enrolled users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {usersLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="max-h-48 overflow-y-auto border rounded-md">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className={`w-full px-3 py-2 text-left hover:bg-muted transition-colors flex items-center justify-between ${
                        selectedUser?.id === user.id ? 'bg-primary/10 border-l-2 border-primary' : ''
                      }`}
                    >
                      <span>{user.display_name || 'Unknown'}</span>
                      {selectedUser?.id === user.id && (
                        <Badge variant="secondary" className="text-xs">Selected</Badge>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  No enrolled users found
                </p>
              )}
              
              {selectedUser && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <UserCheck className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">{selectedUser.display_name}</span>
                </div>
              )}
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
              <Label>Reason (Optional)</Label>
              <Textarea
                placeholder="Enter reason for manual unlock (for audit purposes)"
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
              onClick={handleUnlock} 
              disabled={!selectedUser || createUnlock.isPending}
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

      {/* Bulk Unlock Dialog */}
      <BulkUnlockDialog
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        courseId={courseId}
        courseName={courseName}
        cohortId={cohortId}
      />
    </Card>
  );
}

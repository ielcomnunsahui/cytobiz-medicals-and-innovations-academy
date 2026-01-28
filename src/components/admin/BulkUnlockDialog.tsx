import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Unlock,
  Upload,
  Users,
  BookOpen,
  ClipboardCheck,
  Award,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BulkUnlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  cohortId?: string;
}

interface EnrolledUser {
  id: string;
  display_name: string | null;
  user_id: string;
}

interface ParsedCSVUser {
  identifier: string;
  found: boolean;
  userId?: string;
  displayName?: string;
}

type UnlockType = "content" | "assessment" | "certificate";

export function BulkUnlockDialog({
  isOpen,
  onClose,
  courseId,
  courseName,
  cohortId,
}: BulkUnlockDialogProps) {
  const [activeTab, setActiveTab] = useState<"select" | "csv">("select");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [unlockType, setUnlockType] = useState<UnlockType>("certificate");
  const [reason, setReason] = useState("");
  const [csvContent, setCsvContent] = useState("");
  const [parsedUsers, setParsedUsers] = useState<ParsedCSVUser[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch enrolled users for this course
  const { data: enrolledUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["enrolled-users-bulk", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          user_id,
          profiles!inner(user_id, display_name)
        `)
        .eq("course_id", courseId);

      if (error) throw error;

      return (
        data?.map((enrollment) => ({
          id: enrollment.user_id,
          user_id: enrollment.user_id,
          display_name: (enrollment.profiles as any)?.display_name || "Unknown User",
        })) || []
      );
    },
    enabled: isOpen && !!courseId,
  });

  // Bulk create unlocks mutation
  const bulkUnlockMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      const { data: currentUser } = await supabase.auth.getUser();

      const unlocks = userIds.map((userId) => ({
        user_id: userId,
        course_id: courseId,
        cohort_id: cohortId || null,
        unlock_type: unlockType,
        unlocked_by: currentUser.user?.id,
        reason: reason || `Bulk unlock - ${new Date().toLocaleDateString()}`,
      }));

      const { data, error } = await supabase
        .from("access_unlocks")
        .upsert(unlocks, {
          onConflict: "user_id,course_id,unlock_type",
          ignoreDuplicates: true,
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course-unlocks", courseId] });
      toast.success(`Successfully unlocked access for ${data?.length || 0} users`);
      handleClose();
    },
    onError: (error: any) => {
      toast.error(`Failed to unlock: ${error.message}`);
    },
  });

  const handleClose = () => {
    setSelectedUserIds(new Set());
    setCsvContent("");
    setParsedUsers([]);
    setReason("");
    onClose();
  };

  const toggleUser = (userId: string) => {
    const newSet = new Set(selectedUserIds);
    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    setSelectedUserIds(newSet);
  };

  const toggleAllUsers = () => {
    if (!enrolledUsers) return;
    if (selectedUserIds.size === enrolledUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(enrolledUsers.map((u) => u.id)));
    }
  };

  const parseCSV = useCallback(async () => {
    if (!csvContent.trim()) {
      toast.error("Please paste CSV content first");
      return;
    }

    setIsProcessing(true);

    try {
      // Parse CSV - expect user identifiers (emails or display names) in first column
      const lines = csvContent
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.toLowerCase().startsWith("email") && !line.toLowerCase().startsWith("name"));

      const identifiers = lines.map((line) => {
        const parts = line.split(",");
        return parts[0]?.trim().replace(/"/g, "");
      }).filter(Boolean);

      // Match against enrolled users
      const results: ParsedCSVUser[] = identifiers.map((identifier) => {
        const foundUser = enrolledUsers?.find(
          (u) =>
            u.display_name?.toLowerCase() === identifier.toLowerCase() ||
            u.user_id.toLowerCase() === identifier.toLowerCase()
        );

        return {
          identifier,
          found: !!foundUser,
          userId: foundUser?.id,
          displayName: foundUser?.display_name || undefined,
        };
      });

      setParsedUsers(results);

      // Auto-select found users
      const foundUserIds = results.filter((u) => u.found && u.userId).map((u) => u.userId!);
      setSelectedUserIds(new Set(foundUserIds));

      const foundCount = results.filter((u) => u.found).length;
      const notFoundCount = results.filter((u) => !u.found).length;

      if (notFoundCount > 0) {
        toast.warning(`Found ${foundCount} users, ${notFoundCount} not found in enrollments`);
      } else {
        toast.success(`All ${foundCount} users matched`);
      }
    } catch (error) {
      toast.error("Failed to parse CSV");
    } finally {
      setIsProcessing(false);
    }
  }, [csvContent, enrolledUsers]);

  const handleBulkUnlock = () => {
    if (selectedUserIds.size === 0) {
      toast.error("Please select at least one user");
      return;
    }
    bulkUnlockMutation.mutate(Array.from(selectedUserIds));
  };

  const getUnlockTypeIcon = (type: UnlockType) => {
    switch (type) {
      case "content":
        return <BookOpen className="w-4 h-4" />;
      case "assessment":
        return <ClipboardCheck className="w-4 h-4" />;
      case "certificate":
        return <Award className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Bulk Access Unlock
          </DialogTitle>
          <DialogDescription>
            Grant access to multiple users on "{courseName}"
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden space-y-4">
          {/* Unlock Type Selection */}
          <div className="space-y-2">
            <Label>Access Type to Unlock</Label>
            <Select value={unlockType} onValueChange={(v) => setUnlockType(v as UnlockType)}>
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

          {/* Tabs for selection method */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "select" | "csv")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Multi-Select
              </TabsTrigger>
              <TabsTrigger value="csv" className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                CSV Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="select" className="space-y-3 mt-4">
              {usersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : enrolledUsers && enrolledUsers.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={
                          enrolledUsers.length > 0 &&
                          selectedUserIds.size === enrolledUsers.length
                        }
                        onCheckedChange={toggleAllUsers}
                      />
                      <Label className="text-sm cursor-pointer" onClick={toggleAllUsers}>
                        Select All ({enrolledUsers.length} users)
                      </Label>
                    </div>
                    <Badge variant="secondary">
                      {selectedUserIds.size} selected
                    </Badge>
                  </div>
                  <ScrollArea className="h-[200px] border rounded-md p-2">
                    <div className="space-y-1">
                      {enrolledUsers.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                        >
                          <Checkbox
                            checked={selectedUserIds.has(user.id)}
                            onCheckedChange={() => toggleUser(user.id)}
                          />
                          <span className="text-sm">{user.display_name}</span>
                        </label>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No enrolled users found for this course</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="csv" className="space-y-3 mt-4">
              <div className="space-y-2">
                <Label>Paste CSV Content</Label>
                <p className="text-xs text-muted-foreground">
                  Paste a list of user names or IDs (one per line, or comma-separated CSV).
                  Header row is optional.
                </p>
                <Textarea
                  placeholder="John Doe&#10;Jane Smith&#10;user@example.com"
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  rows={5}
                  className="font-mono text-sm"
                />
                <Button
                  onClick={parseCSV}
                  disabled={isProcessing || !csvContent.trim()}
                  variant="secondary"
                  size="sm"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Parse & Match Users
                    </>
                  )}
                </Button>
              </div>

              {parsedUsers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Matched Users</Label>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {parsedUsers.filter((u) => u.found).length} found
                      </Badge>
                      {parsedUsers.filter((u) => !u.found).length > 0 && (
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          <XCircle className="w-3 h-3 mr-1" />
                          {parsedUsers.filter((u) => !u.found).length} not found
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ScrollArea className="h-[150px] border rounded-md p-2">
                    <div className="space-y-1">
                      {parsedUsers.map((user, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                            user.found
                              ? "bg-green-50 dark:bg-green-950/30"
                              : "bg-red-50 dark:bg-red-950/30"
                          }`}
                        >
                          {user.found ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                          )}
                          <span className="truncate">
                            {user.found ? user.displayName : user.identifier}
                          </span>
                          {!user.found && (
                            <span className="text-xs text-red-600 ml-auto">
                              Not enrolled
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Reason */}
          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea
              placeholder="Enter reason for bulk unlock (for audit purposes)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleBulkUnlock}
            disabled={selectedUserIds.size === 0 || bulkUnlockMutation.isPending}
          >
            {bulkUnlockMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Unlocking...
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 mr-2" />
                Unlock {selectedUserIds.size} User{selectedUserIds.size !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

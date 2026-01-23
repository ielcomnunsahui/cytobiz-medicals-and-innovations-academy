import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  Check, 
  X, 
  Trash2, 
  MessageSquare,
  Search,
  Filter,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useAdminCourseReviews,
  useApproveReview,
  useDeleteReview,
} from "@/hooks/useCourseReviews";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function AdminReviews() {
  const { data: reviews, isLoading } = useAdminCourseReviews();
  const approveReview = useApproveReview();
  const deleteReview = useDeleteReview();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved">("all");

  const filteredReviews = (reviews || []).filter((review: any) => {
    const matchesSearch = 
      review.profiles?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.courses?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.review?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "pending" && !review.is_approved) ||
      (statusFilter === "approved" && review.is_approved);
    
    return matchesSearch && matchesStatus;
  });

  const pendingCount = (reviews || []).filter((r: any) => !r.is_approved).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Course Reviews</h1>
            <p className="text-muted-foreground">
              Manage student reviews and ratings
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                  {pendingCount} pending
                </Badge>
              )}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, course, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
                <div className="h-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No reviews found</h3>
            <p className="text-muted-foreground text-sm">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Student reviews will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review: any, index: number) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-card rounded-xl p-6 border ${
                  review.is_approved ? "border-border" : "border-amber-300 dark:border-amber-700"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* User & Rating */}
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.profiles?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {review.profiles?.display_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">
                          {review.profiles?.display_name || "Unknown User"}
                        </span>
                        <Badge variant={review.is_approved ? "default" : "secondary"}>
                          {review.is_approved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Link 
                          to={`/courses/${review.courses?.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {review.courses?.title || "Unknown Course"}
                        </Link>
                        <span>•</span>
                        <span>{format(new Date(review.created_at), "MMM d, yyyy")}</span>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-gold fill-gold"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">
                          ({review.rating}/5)
                        </span>
                      </div>
                      
                      {/* Review Text */}
                      {review.review && (
                        <p className="text-foreground">{review.review}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:flex-shrink-0">
                    {!review.is_approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => approveReview.mutate({ id: review.id, approved: true })}
                        disabled={approveReview.isPending}
                        className="text-success border-success/30 hover:bg-success/10"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    {review.is_approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => approveReview.mutate({ id: review.id, approved: false })}
                        disabled={approveReview.isPending}
                        className="text-muted-foreground"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Unapprove
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Review</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteReview.mutate(review.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

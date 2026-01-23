import { motion } from "framer-motion";
import { Star, MessageSquare, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCourseReviews, useCourseAverageRating } from "@/hooks/useCourseReviews";
import { format } from "date-fns";

interface CourseReviewsListProps {
  courseId: string;
}

export function CourseReviewsList({ courseId }: CourseReviewsListProps) {
  const { data: reviews, isLoading } = useCourseReviews(courseId);
  const { data: ratingData } = useCourseAverageRating(courseId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/6" />
              </div>
            </div>
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!reviews?.length) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="font-semibold text-foreground mb-2">No reviews yet</h3>
        <p className="text-muted-foreground text-sm">
          Be the first to share your experience with this course!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {ratingData && ratingData.count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground">{ratingData.average}</div>
              <div className="flex items-center justify-center gap-1 my-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(ratingData.average)
                        ? "text-gold fill-gold"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {ratingData.count} {ratingData.count === 1 ? "review" : "reviews"}
              </p>
            </div>
            
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const percentage = (count / ratingData.count) * 100;
                
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm text-muted-foreground">{star}</span>
                      <Star className="w-4 h-4 text-gold fill-gold" />
                    </div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.1 * (5 - star) }}
                        className="h-full bg-gold"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-start gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={review.profiles?.avatar_url || undefined}
                  alt={review.profiles?.display_name || "User"}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {review.profiles?.display_name?.[0] || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <span className="font-medium text-foreground">
                    {review.profiles?.display_name || "Anonymous"}
                  </span>
                  <div className="flex items-center gap-1">
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
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(review.created_at), "MMM d, yyyy")}
                  </span>
                </div>

                {review.review && (
                  <p className="text-muted-foreground">{review.review}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  useUserCourseReview,
  useCreateCourseReview,
  useUpdateCourseReview,
} from "@/hooks/useCourseReviews";

interface CourseReviewFormProps {
  courseId: string;
  isEnrolled: boolean;
}

export function CourseReviewForm({ courseId, isEnrolled }: CourseReviewFormProps) {
  const { user } = useAuth();
  const { data: existingReview, isLoading } = useUserCourseReview(courseId, user?.id);
  const createReview = useCreateCourseReview();
  const updateReview = useUpdateCourseReview();

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState(existingReview?.review || "");
  const [isEditing, setIsEditing] = useState(false);

  // Update state when existing review loads
  useState(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReview(existingReview.review || "");
    }
  });

  if (!user || !isEnrolled) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4" />
        <div className="h-20 bg-muted rounded" />
      </div>
    );
  }

  const handleSubmit = async () => {
    if (rating === 0) return;

    if (existingReview) {
      await updateReview.mutateAsync({
        id: existingReview.id,
        course_id: courseId,
        rating,
        review,
      });
      setIsEditing(false);
    } else {
      await createReview.mutateAsync({
        course_id: courseId,
        user_id: user.id,
        rating,
        review,
      });
    }
  };

  // If review exists and not editing, show review summary
  if (existingReview && !isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Your Review</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRating(existingReview.rating);
              setReview(existingReview.review || "");
              setIsEditing(true);
            }}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < existingReview.rating
                  ? "text-gold fill-gold"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {existingReview.review && (
          <p className="text-muted-foreground">{existingReview.review}</p>
        )}

        {!existingReview.is_approved && (
          <p className="text-sm text-muted-foreground mt-3 italic">
            Your review is pending approval.
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-6 border border-border"
    >
      <h3 className="font-semibold text-foreground mb-4">
        {existingReview ? "Update Your Review" : "Rate This Course"}
      </h3>

      {/* Star Rating */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground mr-2">Your rating:</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  i < (hoveredRating || rating)
                    ? "text-gold fill-gold"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <span className="text-sm font-medium text-foreground ml-2">
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </span>
        )}
      </div>

      {/* Review Text */}
      <Textarea
        placeholder="Share your experience with this course (optional)..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="mb-4 min-h-[100px] resize-none"
      />

      {/* Submit Button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={rating === 0 || createReview.isPending || updateReview.isPending}
        >
          {createReview.isPending || updateReview.isPending ? (
            "Submitting..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {existingReview ? "Update Review" : "Submit Review"}
            </>
          )}
        </Button>
        {isEditing && (
          <Button variant="ghost" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}
      </div>
    </motion.div>
  );
}

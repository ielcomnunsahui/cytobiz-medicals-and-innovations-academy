import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Lock,
  FileText,
  Video,
  Award,
  Users,
  Menu,
  X,
  ExternalLink,
  ClipboardCheck,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ModuleAssessment } from "@/components/learn/ModuleAssessment";
import { ScormPlayer } from "@/components/learn/ScormPlayer";
import { LessonContent } from "@/components/learn/LessonContent";
import {
  useModuleAssessmentStatus,
  useAssessmentAttempts,
  type Assessment,
} from "@/hooks/useAssessments";

// Helper function to extract YouTube embed URL
function getYouTubeEmbedUrl(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

interface ModuleWithLessons {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: Lesson[];
  assessment?: Assessment | null;
}

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

export default function LearnPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [showAssessment, setShowAssessment] = useState<string | null>(null); // module id

  // Check if user is enrolled
  const { data: enrollment, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["enrollment", courseId, user?.id],
    queryFn: async () => {
      if (!user?.id || !courseId) return null;
      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .single();
      
      if (error) return null;
      return data;
    },
    enabled: !!user?.id && !!courseId,
  });

  // Fetch course with modules, lessons, and assessments
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["learn-course", courseId],
    queryFn: async () => {
      if (!courseId) return null;
      
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*, modules_locked_until_assessment")
        .eq("id", courseId)
        .single();
      
      if (courseError) throw courseError;
      
      const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select(`
          *,
          lessons (*)
        `)
        .eq("course_id", courseId)
        .order("order_index");
      
      if (modulesError) throw modulesError;

      // Get assessments for all modules
      const moduleIds = modules?.map(m => m.id) || [];
      const { data: assessments, error: assessmentsError } = await supabase
        .from("assessments")
        .select("*")
        .in("module_id", moduleIds);
      
      if (assessmentsError) throw assessmentsError;
      
      return {
        ...courseData,
        modules: modules?.map(m => ({
          ...m,
          lessons: m.lessons?.sort((a: Lesson, b: Lesson) => a.order_index - b.order_index) || [],
          assessment: assessments?.find(a => a.module_id === m.id) || null,
        })) || [],
      };
    },
    enabled: !!courseId,
  });

  // Fetch lesson progress
  const { data: lessonProgress } = useQuery({
    queryKey: ["lesson-progress", user?.id, courseId],
    queryFn: async () => {
      if (!user?.id || !courseId) return {};
      
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) return {};
      
      const progressMap: Record<string, boolean> = {};
      data?.forEach((p) => {
        progressMap[p.lesson_id] = p.completed || false;
      });
      return progressMap;
    },
    enabled: !!user?.id && !!courseId,
  });

  // Get module assessment status
  const moduleIds = course?.modules?.map((m: ModuleWithLessons) => m.id) || [];
  const { data: assessmentStatus } = useModuleAssessmentStatus(user?.id, moduleIds);

  // Get assessment attempts for current assessment
  const currentAssessmentModule = course?.modules?.find(
    (m: ModuleWithLessons) => m.id === showAssessment
  );
  const { data: currentAttempts } = useAssessmentAttempts(
    user?.id,
    currentAssessmentModule?.assessment?.id
  );

  // Mark lesson complete mutation
  const markCompleteMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from("lesson_progress")
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: "user_id,lesson_id" });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress"] });
    },
  });

  // Check if module is locked
  const isModuleLocked = (moduleIndex: number): boolean => {
    if (!course?.modules_locked_until_assessment) return false;
    if (moduleIndex === 0) return false;
    
    // Check if previous module has a required assessment that hasn't been passed
    const prevModule = course.modules[moduleIndex - 1] as ModuleWithLessons;
    if (prevModule?.assessment?.is_required) {
      const status = assessmentStatus?.[prevModule.id];
      if (!status?.passed) {
        return true;
      }
    }
    return false;
  };

  // Check if all lessons in a module are completed
  const isModuleComplete = (module: ModuleWithLessons): boolean => {
    return module.lessons.every((lesson) => lessonProgress?.[lesson.id]);
  };

  // Get all lessons flat
  const allLessons = course?.modules?.flatMap((m: ModuleWithLessons) => m.lessons) || [];
  
  // Set initial lesson
  useEffect(() => {
    if (allLessons.length > 0 && !currentLessonId && !showAssessment) {
      // Find first incomplete lesson that's not in a locked module
      const firstIncomplete = allLessons.find((l, index) => {
        const moduleIndex = course?.modules?.findIndex(
          (m: ModuleWithLessons) => m.lessons.some((lesson) => lesson.id === l.id)
        );
        return !lessonProgress?.[l.id] && !isModuleLocked(moduleIndex || 0);
      });
      setCurrentLessonId(firstIncomplete?.id || allLessons[0]?.id);
    }
  }, [allLessons, lessonProgress, currentLessonId, showAssessment, course?.modules]);

  const currentLesson = allLessons.find((l) => l.id === currentLessonId);
  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  // Calculate progress
  const completedCount = Object.values(lessonProgress || {}).filter(Boolean).length;
  const progressPercent = allLessons.length > 0 ? (completedCount / allLessons.length) * 100 : 0;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Redirect if not enrolled
  useEffect(() => {
    if (!enrollmentLoading && !enrollment && user) {
      navigate(`/courses/${course?.slug || courseId}`);
    }
  }, [enrollment, enrollmentLoading, user, navigate, course?.slug, courseId]);

  if (authLoading || courseLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.lesson_type === "scorm") return Package;
    if (lesson.video_url) return Video;
    return FileText;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-80 bg-card border-r border-border transform transition-transform duration-300 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="font-semibold text-foreground line-clamp-2">{course.title}</h2>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto p-4">
          {course.modules?.map((module: ModuleWithLessons, moduleIndex: number) => {
            const locked = isModuleLocked(moduleIndex);
            const moduleComplete = isModuleComplete(module);
            const hasAssessment = !!module.assessment;
            const assessmentPassed = assessmentStatus?.[module.id]?.passed;
            
            return (
              <div key={module.id} className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  {locked ? (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  ) : moduleComplete ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : null}
                  <h3 className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    locked ? "text-muted-foreground/50" : "text-muted-foreground"
                  )}>
                    Module {moduleIndex + 1}: {module.title}
                  </h3>
                </div>

                <div className="space-y-1">
                  {module.lessons?.map((lesson) => {
                    const isCompleted = lessonProgress?.[lesson.id];
                    const isCurrent = lesson.id === currentLessonId && !showAssessment;
                    const LessonIcon = getLessonIcon(lesson);
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          if (!locked) {
                            setCurrentLessonId(lesson.id);
                            setShowAssessment(null);
                          }
                        }}
                        disabled={locked}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                          locked
                            ? "opacity-50 cursor-not-allowed"
                            : isCurrent
                              ? "bg-primary/10 text-primary"
                              : isCompleted
                                ? "text-muted-foreground hover:bg-muted"
                                : "text-foreground hover:bg-muted"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                          isCompleted ? "bg-success text-success-foreground" : isCurrent ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          {locked ? (
                            <Lock className="w-3 h-3" />
                          ) : isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <LessonIcon className="w-3 h-3" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-medium truncate", isCompleted && "line-through opacity-60")}>
                            {lesson.title}
                          </p>
                          {lesson.duration_minutes && (
                            <p className="text-xs text-muted-foreground">{lesson.duration_minutes} min</p>
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* Assessment Button */}
                  {hasAssessment && (
                    <button
                      onClick={() => {
                        if (!locked) {
                          setShowAssessment(module.id);
                          setCurrentLessonId(null);
                        }
                      }}
                      disabled={locked}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors border-2 border-dashed",
                        locked
                          ? "opacity-50 cursor-not-allowed border-border"
                          : showAssessment === module.id
                            ? "border-primary bg-primary/10 text-primary"
                            : assessmentPassed
                              ? "border-success/50 text-success hover:bg-success/5"
                              : "border-amber-500/50 text-amber-600 hover:bg-amber-500/5"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                        assessmentPassed ? "bg-success text-success-foreground" : "bg-amber-500/20"
                      )}>
                        {assessmentPassed ? (
                          <Award className="w-4 h-4" />
                        ) : (
                          <ClipboardCheck className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Module Assessment</p>
                        <p className="text-xs opacity-70">
                          {assessmentPassed ? "Passed" : module.assessment?.is_required ? "Required" : "Optional"}
                        </p>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "lg:ml-80" : "ml-0"
      )}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {showAssessment ? "Module Assessment" : currentLesson?.title}
              </span>
            </div>
            {!showAssessment && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!prevLesson}
                  onClick={() => prevLesson && setCurrentLessonId(prevLesson.id)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  size="sm"
                  disabled={!nextLesson}
                  onClick={() => nextLesson && setCurrentLessonId(nextLesson.id)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Assessment View */}
          {showAssessment && currentAssessmentModule?.assessment && user && (
            <ModuleAssessment
              assessment={currentAssessmentModule.assessment}
              userId={user.id}
              previousAttempts={currentAttempts || []}
              onComplete={(passed) => {
                queryClient.invalidateQueries({ queryKey: ["module-assessment-status"] });
                if (passed) {
                  // Navigate to next module's first lesson after passing
                  const currentModuleIndex = course.modules.findIndex(
                    (m: ModuleWithLessons) => m.id === showAssessment
                  );
                  const nextModule = course.modules[currentModuleIndex + 1] as ModuleWithLessons | undefined;
                  if (nextModule?.lessons?.[0]) {
                    setTimeout(() => {
                      setShowAssessment(null);
                      setCurrentLessonId(nextModule.lessons[0].id);
                    }, 2000);
                  }
                }
              }}
            />
          )}

          {/* Lesson View */}
          {!showAssessment && currentLesson && (
            <motion.div
              key={currentLesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* SCORM Player */}
              {currentLesson.lesson_type === "scorm" && currentLesson.external_url && (
                <ScormPlayer
                  scormUrl={currentLesson.external_url}
                  title={currentLesson.title}
                  learnerId={user?.id}
                  learnerName={user?.user_metadata?.display_name || user?.email || "Learner"}
                  onComplete={() => markCompleteMutation.mutate(currentLesson.id)}
                />
              )}

              {/* YouTube Video Player */}
              {currentLesson.video_url && currentLesson.lesson_type !== "scorm" && (
                <div className="aspect-video bg-black rounded-2xl mb-8 overflow-hidden">
                  {currentLesson.video_url.includes("youtube.com") || currentLesson.video_url.includes("youtu.be") ? (
                    <iframe
                      src={getYouTubeEmbedUrl(currentLesson.video_url)}
                      title={currentLesson.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-sm opacity-70">Video: {currentLesson.video_url}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* External URL Link */}
              {currentLesson.external_url && currentLesson.lesson_type !== "scorm" && (
                <a
                  href={currentLesson.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 mb-8 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">External Resource</p>
                    <p className="text-sm text-muted-foreground truncate max-w-md">
                      {currentLesson.external_url}
                    </p>
                  </div>
                </a>
              )}

              {/* Document Link */}
              {currentLesson.document_url && (
                <a
                  href={currentLesson.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 mb-8 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Download Document</p>
                    <p className="text-sm text-muted-foreground">Click to open PDF or document</p>
                  </div>
                </a>
              )}

              {/* Lesson Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {currentLesson.title}
              </h1>

              {/* Lesson Content with Image Support */}
              {currentLesson.content && (
                <LessonContent content={currentLesson.content} />
              )}

              {/* Mark Complete Button */}
              <div className="flex items-center gap-4 pt-8 border-t border-border">
                {lessonProgress?.[currentLesson.id] ? (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Completed</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => markCompleteMutation.mutate(currentLesson.id)}
                    disabled={markCompleteMutation.isPending}
                    className="bg-success hover:bg-success/90"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Complete
                  </Button>
                )}

                {nextLesson && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!lessonProgress?.[currentLesson.id]) {
                        markCompleteMutation.mutate(currentLesson.id);
                      }
                      setCurrentLessonId(nextLesson.id);
                    }}
                  >
                    Continue to Next Lesson
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* No Content Selected */}
          {!showAssessment && !currentLesson && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No lesson selected</h2>
              <p className="text-muted-foreground">Select a lesson from the sidebar to begin.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

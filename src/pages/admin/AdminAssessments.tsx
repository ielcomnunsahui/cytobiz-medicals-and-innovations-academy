import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ClipboardCheck,
  Save,
  GripVertical,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  points: number;
  order_index: number;
}

interface Assessment {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  pass_percentage: number;
  is_required: boolean;
  time_limit_minutes: number | null;
  questions?: Question[];
}

interface Module {
  id: string;
  title: string;
  order_index: number;
}

export default function AdminAssessments() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [creatingForModule, setCreatingForModule] = useState<string | null>(null);
  const [deletingAssessment, setDeletingAssessment] = useState<Assessment | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [creatingQuestionFor, setCreatingQuestionFor] = useState<string | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null);

  const [assessmentForm, setAssessmentForm] = useState({
    title: "",
    description: "",
    pass_percentage: 70,
    is_required: true,
    time_limit_minutes: "",
  });

  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    question_type: "multiple_choice",
    options: ["", "", "", ""],
    correct_answer: "",
    points: 1,
  });

  // Fetch course and modules
  const { data: course, isLoading } = useQuery({
    queryKey: ["admin-course-assessments", courseId],
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
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");

      if (modulesError) throw modulesError;

      // Get assessments for all modules
      const moduleIds = modules?.map((m) => m.id) || [];
      const { data: assessments, error: assessmentsError } = await supabase
        .from("assessments")
        .select("*")
        .in("module_id", moduleIds);

      if (assessmentsError) throw assessmentsError;

      // Get questions for all assessments
      const assessmentIds = assessments?.map((a) => a.id) || [];
      const { data: questions, error: questionsError } = await supabase
        .from("assessment_questions")
        .select("*")
        .in("assessment_id", assessmentIds)
        .order("order_index");

      if (questionsError) throw questionsError;

      // Map questions to assessments and cast options
      const assessmentsWithQuestions = assessments?.map((a) => ({
        ...a,
        questions: (questions?.filter((q) => q.assessment_id === a.id) || []).map(q => ({
          ...q,
          options: Array.isArray(q.options) ? q.options as string[] : []
        })),
      }));

      // Map assessments to modules
      const modulesWithAssessments = modules?.map((m) => ({
        ...m,
        assessment: assessmentsWithQuestions?.find((a) => a.module_id === m.id) || null,
      }));

      return {
        ...courseData,
        modules: modulesWithAssessments || [],
      };
    },
    enabled: !!courseId,
  });

  // Toggle module locking mutation
  const toggleModuleLocking = useMutation({
    mutationFn: async (locked: boolean) => {
      const { error } = await supabase
        .from("courses")
        .update({ modules_locked_until_assessment: locked })
        .eq("id", courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-assessments"] });
      toast.success("Module locking setting updated");
    },
    onError: (error) => {
      toast.error("Failed to update setting: " + (error as Error).message);
    },
  });

  // Create assessment mutation
  const createAssessment = useMutation({
    mutationFn: async (data: { moduleId: string; form: typeof assessmentForm }) => {
      const { error } = await supabase.from("assessments").insert({
        module_id: data.moduleId,
        title: data.form.title,
        description: data.form.description || null,
        pass_percentage: data.form.pass_percentage,
        is_required: data.form.is_required,
        time_limit_minutes: data.form.time_limit_minutes ? parseInt(data.form.time_limit_minutes) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-assessments"] });
      toast.success("Assessment created successfully");
      setCreatingForModule(null);
      resetAssessmentForm();
    },
    onError: (error) => {
      toast.error("Failed to create assessment: " + (error as Error).message);
    },
  });

  // Update assessment mutation
  const updateAssessment = useMutation({
    mutationFn: async (data: { id: string; form: typeof assessmentForm }) => {
      const { error } = await supabase
        .from("assessments")
        .update({
          title: data.form.title,
          description: data.form.description || null,
          pass_percentage: data.form.pass_percentage,
          is_required: data.form.is_required,
          time_limit_minutes: data.form.time_limit_minutes ? parseInt(data.form.time_limit_minutes) : null,
        })
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-assessments"] });
      toast.success("Assessment updated successfully");
      setEditingAssessment(null);
      resetAssessmentForm();
    },
    onError: (error) => {
      toast.error("Failed to update assessment: " + (error as Error).message);
    },
  });

  // Delete assessment mutation
  const deleteAssessment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("assessments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-assessments"] });
      toast.success("Assessment deleted successfully");
      setDeletingAssessment(null);
    },
    onError: (error) => {
      toast.error("Failed to delete assessment: " + (error as Error).message);
    },
  });

  // Create question mutation
  const createQuestion = useMutation({
    mutationFn: async (data: { assessmentId: string; form: typeof questionForm }) => {
      const assessment = course?.modules?.find((m: any) => m.assessment?.id === data.assessmentId)?.assessment;
      const maxOrder = assessment?.questions?.length || 0;

      const { error } = await supabase.from("assessment_questions").insert({
        assessment_id: data.assessmentId,
        question_text: data.form.question_text,
        question_type: data.form.question_type,
        options: data.form.options.filter((o) => o.trim() !== ""),
        correct_answer: data.form.correct_answer,
        points: data.form.points,
        order_index: maxOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-assessments"] });
      toast.success("Question added successfully");
      setCreatingQuestionFor(null);
      resetQuestionForm();
    },
    onError: (error) => {
      toast.error("Failed to add question: " + (error as Error).message);
    },
  });

  // Update question mutation
  const updateQuestion = useMutation({
    mutationFn: async (data: { id: string; form: typeof questionForm }) => {
      const { error } = await supabase
        .from("assessment_questions")
        .update({
          question_text: data.form.question_text,
          question_type: data.form.question_type,
          options: data.form.options.filter((o) => o.trim() !== ""),
          correct_answer: data.form.correct_answer,
          points: data.form.points,
        })
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-assessments"] });
      toast.success("Question updated successfully");
      setEditingQuestion(null);
      resetQuestionForm();
    },
    onError: (error) => {
      toast.error("Failed to update question: " + (error as Error).message);
    },
  });

  // Delete question mutation
  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("assessment_questions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-course-assessments"] });
      toast.success("Question deleted successfully");
      setDeletingQuestion(null);
    },
    onError: (error) => {
      toast.error("Failed to delete question: " + (error as Error).message);
    },
  });

  const resetAssessmentForm = () => {
    setAssessmentForm({
      title: "",
      description: "",
      pass_percentage: 70,
      is_required: true,
      time_limit_minutes: "",
    });
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      question_text: "",
      question_type: "multiple_choice",
      options: ["", "", "", ""],
      correct_answer: "",
      points: 1,
    });
  };

  const openEditAssessment = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setAssessmentForm({
      title: assessment.title,
      description: assessment.description || "",
      pass_percentage: assessment.pass_percentage,
      is_required: assessment.is_required,
      time_limit_minutes: assessment.time_limit_minutes?.toString() || "",
    });
  };

  const openEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    const opts = [...(question.options || [])];
    while (opts.length < 4) opts.push("");
    setQuestionForm({
      question_text: question.question_text,
      question_type: question.question_type,
      options: opts,
      correct_answer: question.correct_answer,
      points: question.points,
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
            <h1 className="text-2xl font-bold text-foreground">Manage Assessments</h1>
            <p className="text-muted-foreground">{course.title}</p>
          </div>
        </div>

        {/* Module Locking Toggle */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Lock Modules Until Assessment Passed</h3>
              <p className="text-sm text-muted-foreground mt-1">
                When enabled, students must pass each module's assessment before accessing the next module
              </p>
            </div>
            <Switch
              checked={course.modules_locked_until_assessment || false}
              onCheckedChange={(checked) => toggleModuleLocking.mutate(checked)}
            />
          </div>
        </div>

        {/* Modules with Assessments */}
        <div className="space-y-6">
          {course.modules?.map((module: any, moduleIndex: number) => (
            <div key={module.id} className="border border-border rounded-xl bg-card overflow-hidden">
              {/* Module Header */}
              <div className="p-4 bg-muted/50 border-b border-border flex items-center gap-3">
                <ClipboardCheck className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold">
                    Module {moduleIndex + 1}: {module.title}
                  </h3>
                </div>
                {!module.assessment && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setCreatingForModule(module.id);
                      resetAssessmentForm();
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Assessment
                  </Button>
                )}
              </div>

              {/* Assessment Details */}
              <div className="p-4">
                {module.assessment ? (
                  <div className="space-y-4">
                    {/* Assessment Info */}
                    <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h4 className="font-medium">{module.assessment.title}</h4>
                        {module.assessment.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {module.assessment.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <Badge variant={module.assessment.is_required ? "default" : "outline"}>
                            {module.assessment.is_required ? "Required" : "Optional"}
                          </Badge>
                          <span className="text-muted-foreground">
                            Pass Mark: {module.assessment.pass_percentage}%
                          </span>
                          {module.assessment.time_limit_minutes && (
                            <span className="text-muted-foreground">
                              Time: {module.assessment.time_limit_minutes} min
                            </span>
                          )}
                          <span className="text-muted-foreground">
                            {module.assessment.questions?.length || 0} questions
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditAssessment(module.assessment)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => setDeletingAssessment(module.assessment)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium text-muted-foreground">Questions</h5>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCreatingQuestionFor(module.assessment.id);
                            resetQuestionForm();
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Question
                        </Button>
                      </div>

                      {module.assessment.questions?.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
                          No questions yet. Add your first question.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {module.assessment.questions?.map((question: Question, qIndex: number) => (
                            <div
                              key={question.id}
                              className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                            >
                              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center flex-shrink-0">
                                {qIndex + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">{question.question_text}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                  <Badge variant="outline" className="text-xs">
                                    {question.question_type === "multiple_choice" ? "Multiple Choice" : "True/False"}
                                  </Badge>
                                  <span>{question.points} point{question.points !== 1 ? "s" : ""}</span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditQuestion(question)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => setDeletingQuestion(question)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No assessment for this module yet.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Assessment Dialog */}
        <Dialog
          open={!!creatingForModule || !!editingAssessment}
          onOpenChange={(open) => {
            if (!open) {
              setCreatingForModule(null);
              setEditingAssessment(null);
              resetAssessmentForm();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAssessment ? "Edit Assessment" : "Create Assessment"}
              </DialogTitle>
              <DialogDescription>
                Configure the assessment settings and pass requirements
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={assessmentForm.title}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
                  placeholder="e.g., Module 1 Quiz"
                />
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  value={assessmentForm.description}
                  onChange={(e) => setAssessmentForm({ ...assessmentForm, description: e.target.value })}
                  placeholder="Brief description of the assessment"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pass Percentage (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={assessmentForm.pass_percentage}
                    onChange={(e) =>
                      setAssessmentForm({ ...assessmentForm, pass_percentage: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time Limit (minutes, optional)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={assessmentForm.time_limit_minutes}
                    onChange={(e) =>
                      setAssessmentForm({ ...assessmentForm, time_limit_minutes: e.target.value })
                    }
                    placeholder="No limit"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={assessmentForm.is_required}
                  onCheckedChange={(checked) =>
                    setAssessmentForm({ ...assessmentForm, is_required: checked })
                  }
                />
                <Label>Required to unlock next module</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCreatingForModule(null);
                  setEditingAssessment(null);
                  resetAssessmentForm();
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={!assessmentForm.title || createAssessment.isPending || updateAssessment.isPending}
                onClick={() => {
                  if (editingAssessment) {
                    updateAssessment.mutate({ id: editingAssessment.id, form: assessmentForm });
                  } else if (creatingForModule) {
                    createAssessment.mutate({ moduleId: creatingForModule, form: assessmentForm });
                  }
                }}
              >
                {(createAssessment.isPending || updateAssessment.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingAssessment ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create/Edit Question Dialog */}
        <Dialog
          open={!!creatingQuestionFor || !!editingQuestion}
          onOpenChange={(open) => {
            if (!open) {
              setCreatingQuestionFor(null);
              setEditingQuestion(null);
              resetQuestionForm();
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? "Edit Question" : "Add Question"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Question Text</Label>
                <Textarea
                  value={questionForm.question_text}
                  onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                  placeholder="Enter your question here..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={questionForm.question_type}
                    onValueChange={(value) => {
                      setQuestionForm({
                        ...questionForm,
                        question_type: value,
                        options: value === "true_false" ? ["True", "False"] : ["", "", "", ""],
                        correct_answer: "",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border">
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min={1}
                    value={questionForm.points}
                    onChange={(e) =>
                      setQuestionForm({ ...questionForm, points: parseInt(e.target.value) || 1 })
                    }
                  />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <Label>Answer Options</Label>
                <div className="space-y-2">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options];
                          newOptions[index] = e.target.value;
                          setQuestionForm({ ...questionForm, options: newOptions });
                        }}
                        placeholder={`Option ${index + 1}`}
                        disabled={questionForm.question_type === "true_false"}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant={questionForm.correct_answer === option && option ? "default" : "outline"}
                        onClick={() => setQuestionForm({ ...questionForm, correct_answer: option })}
                        disabled={!option}
                        className="flex-shrink-0"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Click the checkmark to set the correct answer
                </p>
              </div>

              {questionForm.correct_answer && (
                <div className="p-3 bg-success/10 rounded-lg flex items-center gap-2 text-success">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Correct answer: {questionForm.correct_answer}</span>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCreatingQuestionFor(null);
                  setEditingQuestion(null);
                  resetQuestionForm();
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  !questionForm.question_text ||
                  !questionForm.correct_answer ||
                  createQuestion.isPending ||
                  updateQuestion.isPending
                }
                onClick={() => {
                  if (editingQuestion) {
                    updateQuestion.mutate({ id: editingQuestion.id, form: questionForm });
                  } else if (creatingQuestionFor) {
                    createQuestion.mutate({ assessmentId: creatingQuestionFor, form: questionForm });
                  }
                }}
              >
                {(createQuestion.isPending || updateQuestion.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingQuestion ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Assessment Confirmation */}
        <AlertDialog open={!!deletingAssessment} onOpenChange={() => setDeletingAssessment(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this assessment and all its questions. Student attempts will also be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => deletingAssessment && deleteAssessment.mutate(deletingAssessment.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Question Confirmation */}
        <AlertDialog open={!!deletingQuestion} onOpenChange={() => setDeletingQuestion(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Question</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this question.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => deletingQuestion && deleteQuestion.mutate(deletingQuestion.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

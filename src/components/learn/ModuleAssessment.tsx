import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  ChevronRight,
  Award,
  RefreshCw,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  useAssessmentQuestions,
  useSubmitAssessment,
  type Assessment,
  type AssessmentAttempt,
} from "@/hooks/useAssessments";

interface ModuleAssessmentProps {
  assessment: Assessment;
  userId: string;
  previousAttempts: AssessmentAttempt[];
  onComplete: (passed: boolean) => void;
}

export function ModuleAssessment({
  assessment,
  userId,
  previousAttempts,
  onComplete,
}: ModuleAssessmentProps) {
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [latestResult, setLatestResult] = useState<AssessmentAttempt | null>(null);

  const { data: questions, isLoading } = useAssessmentQuestions(assessment.id);
  const submitAssessment = useSubmitAssessment();

  const bestAttempt = previousAttempts.length > 0
    ? previousAttempts.reduce((best, current) =>
        current.percentage > best.percentage ? current : best
      )
    : null;

  const hasPassed = previousAttempts.some((a) => a.passed);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!questions) return;

    const result = await submitAssessment.mutateAsync({
      userId,
      assessmentId: assessment.id,
      answers,
      questions,
      passPercentage: assessment.pass_percentage,
    });

    setLatestResult(result);
    setShowResults(true);
    onComplete(result.passed);
  };

  const handleRetry = () => {
    setStarted(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setLatestResult(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Results Screen
  if (showResults && latestResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-8 text-center"
      >
        <div
          className={cn(
            "w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center",
            latestResult.passed ? "bg-success/20" : "bg-destructive/20"
          )}
        >
          {latestResult.passed ? (
            <Award className="w-10 h-10 text-success" />
          ) : (
            <XCircle className="w-10 h-10 text-destructive" />
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2">
          {latestResult.passed ? "Congratulations!" : "Keep Trying!"}
        </h2>
        <p className="text-muted-foreground mb-6">
          {latestResult.passed
            ? "You've passed this assessment and can proceed to the next module."
            : `You need ${assessment.pass_percentage}% to pass. Try again when you're ready.`}
        </p>

        <div className="bg-muted/50 rounded-xl p-6 mb-6">
          <div className="text-4xl font-bold mb-2">
            {latestResult.percentage.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">
            {latestResult.score} / {latestResult.max_score} points
          </div>
          <Progress value={latestResult.percentage} className="h-3 mt-4" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0%</span>
            <span className="text-primary font-medium">Pass: {assessment.pass_percentage}%</span>
            <span>100%</span>
          </div>
        </div>

        {!latestResult.passed && (
          <Button onClick={handleRetry} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </motion.div>
    );
  }

  // Start Screen
  if (!started) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
            <ClipboardCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{assessment.title}</h2>
          {assessment.description && (
            <p className="text-muted-foreground">{assessment.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{questions?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Questions</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{assessment.pass_percentage}%</div>
            <div className="text-sm text-muted-foreground">Pass Mark</div>
          </div>
          {assessment.time_limit_minutes && (
            <div className="bg-muted/50 rounded-lg p-4 text-center col-span-2">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-lg font-bold">{assessment.time_limit_minutes} minutes</span>
              </div>
              <div className="text-sm text-muted-foreground">Time Limit</div>
            </div>
          )}
        </div>

        {previousAttempts.length > 0 && (
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Previous Attempts</span>
              <Badge variant={hasPassed ? "default" : "secondary"}>
                {previousAttempts.length} attempt{previousAttempts.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            {bestAttempt && (
              <div className="mt-2">
                <div className="text-sm">
                  Best Score:{" "}
                  <span className={cn("font-semibold", hasPassed ? "text-success" : "text-foreground")}>
                    {bestAttempt.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {hasPassed ? (
          <div className="flex items-center gap-2 p-4 bg-success/10 rounded-lg text-success mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">You've already passed this assessment!</span>
          </div>
        ) : (
          assessment.is_required && (
            <div className="flex items-center gap-2 p-4 bg-amber-500/10 rounded-lg text-amber-600 mb-4">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">This assessment is required to unlock the next module.</span>
            </div>
          )
        )}

        <Button onClick={() => setStarted(true)} className="w-full" size="lg">
          {hasPassed ? "Retake Assessment" : "Start Assessment"}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // Question Screen
  const currentQuestion = questions?.[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = ((currentQuestionIndex + 1) / (questions?.length || 1)) * 100;

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Progress Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions?.length}
          </span>
          <Badge variant="outline">
            {answeredCount}/{questions?.length} answered
          </Badge>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Question Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-6">{currentQuestion.question_text}</h3>

            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                    answers[currentQuestion.id] === option
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  )}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-normal">
                    {option}
                  </Label>
                </label>
              ))}
            </RadioGroup>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        {currentQuestionIndex === (questions?.length || 0) - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={answeredCount < (questions?.length || 0) || submitAssessment.isPending}
          >
            {submitAssessment.isPending ? "Submitting..." : "Submit Assessment"}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Question Navigation Dots */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {questions?.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={cn(
                "w-8 h-8 rounded-full text-xs font-medium transition-all",
                index === currentQuestionIndex
                  ? "bg-primary text-primary-foreground"
                  : answers[q.id]
                    ? "bg-success/20 text-success"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

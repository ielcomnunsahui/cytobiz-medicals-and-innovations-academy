import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Assessment {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  pass_percentage: number;
  is_required: boolean;
  time_limit_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  points: number;
  order_index: number;
}

export interface AssessmentAttempt {
  id: string;
  user_id: string;
  assessment_id: string;
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  answers: Record<string, string>;
  started_at: string;
  completed_at: string | null;
}

export function useAssessmentsForModule(moduleId: string | undefined) {
  return useQuery({
    queryKey: ["assessments", moduleId],
    queryFn: async () => {
      if (!moduleId) return [];
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("module_id", moduleId);
      
      if (error) throw error;
      return data as Assessment[];
    },
    enabled: !!moduleId,
  });
}

export function useAssessmentQuestions(assessmentId: string | undefined) {
  return useQuery({
    queryKey: ["assessment-questions", assessmentId],
    queryFn: async () => {
      if (!assessmentId) return [];
      const { data, error } = await supabase
        .from("assessment_questions")
        .select("*")
        .eq("assessment_id", assessmentId)
        .order("order_index");
      
      if (error) throw error;
      return data.map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : []
      })) as AssessmentQuestion[];
    },
    enabled: !!assessmentId,
  });
}

export function useAssessmentAttempts(userId: string | undefined, assessmentId?: string) {
  return useQuery({
    queryKey: ["assessment-attempts", userId, assessmentId],
    queryFn: async () => {
      if (!userId) return [];
      
      let query = supabase
        .from("assessment_attempts")
        .select("*")
        .eq("user_id", userId);
      
      if (assessmentId) {
        query = query.eq("assessment_id", assessmentId);
      }
      
      const { data, error } = await query.order("started_at", { ascending: false });
      
      if (error) throw error;
      return data as AssessmentAttempt[];
    },
    enabled: !!userId,
  });
}

export function useModuleAssessmentStatus(userId: string | undefined, moduleIds: string[]) {
  return useQuery({
    queryKey: ["module-assessment-status", userId, moduleIds],
    queryFn: async () => {
      if (!userId || moduleIds.length === 0) return {};
      
      // Get all assessments for these modules
      const { data: assessments, error: assessmentsError } = await supabase
        .from("assessments")
        .select("id, module_id, is_required, pass_percentage")
        .in("module_id", moduleIds);
      
      if (assessmentsError) throw assessmentsError;
      
      if (!assessments || assessments.length === 0) {
        return {};
      }
      
      // Get all attempts for these assessments
      const assessmentIds = assessments.map(a => a.id);
      const { data: attempts, error: attemptsError } = await supabase
        .from("assessment_attempts")
        .select("*")
        .eq("user_id", userId)
        .in("assessment_id", assessmentIds);
      
      if (attemptsError) throw attemptsError;
      
      // Build status map per module
      const statusMap: Record<string, { 
        hasAssessment: boolean; 
        isRequired: boolean;
        passed: boolean; 
        bestScore: number;
        attempts: number;
      }> = {};
      
      for (const assessment of assessments) {
        const moduleAttempts = attempts?.filter(a => a.assessment_id === assessment.id) || [];
        const hasPassed = moduleAttempts.some(a => a.passed);
        const bestScore = moduleAttempts.length > 0 
          ? Math.max(...moduleAttempts.map(a => a.percentage)) 
          : 0;
        
        statusMap[assessment.module_id] = {
          hasAssessment: true,
          isRequired: assessment.is_required,
          passed: hasPassed,
          bestScore,
          attempts: moduleAttempts.length,
        };
      }
      
      return statusMap;
    },
    enabled: !!userId && moduleIds.length > 0,
  });
}

export function useSubmitAssessment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      userId,
      assessmentId,
      answers,
      questions,
      passPercentage,
    }: {
      userId: string;
      assessmentId: string;
      answers: Record<string, string>;
      questions: AssessmentQuestion[];
      passPercentage: number;
    }) => {
      // Calculate score
      let score = 0;
      let maxScore = 0;
      
      for (const question of questions) {
        maxScore += question.points;
        if (answers[question.id] === question.correct_answer) {
          score += question.points;
        }
      }
      
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
      const passed = percentage >= passPercentage;
      
      const { data, error } = await supabase
        .from("assessment_attempts")
        .insert({
          user_id: userId,
          assessment_id: assessmentId,
          score,
          max_score: maxScore,
          percentage,
          passed,
          answers,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as AssessmentAttempt;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment-attempts"] });
      queryClient.invalidateQueries({ queryKey: ["module-assessment-status"] });
    },
  });
}

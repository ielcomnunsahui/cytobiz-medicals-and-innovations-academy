import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const AUTOSAVE_DEBOUNCE_MS = 2000;
const STORAGE_KEY_PREFIX = "enrollment_draft_";

interface UseEnrollmentAutoSaveOptions {
  courseId: string;
  userId: string | null;
  formData: Record<string, any>;
  cohortId: string | null;
  enabled?: boolean;
}

export function useEnrollmentAutoSave({
  courseId,
  userId,
  formData,
  cohortId,
  enabled = true,
}: UseEnrollmentAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `${STORAGE_KEY_PREFIX}${courseId}`;

  // Save to localStorage (immediate)
  const saveToLocalStorage = useCallback(() => {
    if (!enabled) return;
    try {
      const draft = {
        formData,
        cohortId,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(draft));
    } catch (error) {
      console.error("Failed to save draft to localStorage:", error);
    }
  }, [formData, cohortId, storageKey, enabled]);

  // Load from localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load draft from localStorage:", error);
    }
    return null;
  }, [storageKey]);

  // Clear localStorage
  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Failed to clear draft from localStorage:", error);
    }
  }, [storageKey]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!enabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveToLocalStorage();
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, cohortId, saveToLocalStorage, enabled]);

  // Save on page unload
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      saveToLocalStorage();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveToLocalStorage, enabled]);

  return {
    loadDraft: loadFromLocalStorage,
    clearDraft: clearLocalStorage,
    saveDraft: saveToLocalStorage,
  };
}

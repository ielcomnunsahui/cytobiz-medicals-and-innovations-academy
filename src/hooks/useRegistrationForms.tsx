import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type RegistrationForm = Tables<"registration_forms">;
export type RegistrationFormField = Tables<"registration_form_fields">;

export function useRegistrationForms() {
  return useQuery({
    queryKey: ["registration-forms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registration_forms")
        .select(`
          *,
          course:courses(id, title, slug),
          fields:registration_form_fields(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Sort fields by order_index
      return data.map((form) => ({
        ...form,
        fields: form.fields?.sort((a: any, b: any) => a.order_index - b.order_index) || [],
      }));
    },
  });
}

export function useRegistrationForm(formId: string | null) {
  return useQuery({
    queryKey: ["registration-form", formId],
    enabled: !!formId,
    queryFn: async () => {
      if (!formId) return null;
      
      const { data, error } = await supabase
        .from("registration_forms")
        .select(`
          *,
          course:courses(id, title, slug),
          fields:registration_form_fields(*)
        `)
        .eq("id", formId)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        fields: data.fields?.sort((a: any, b: any) => a.order_index - b.order_index) || [],
      };
    },
  });
}

export function useCreateRegistrationForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: TablesInsert<"registration_forms">) => {
      const { data, error } = await supabase
        .from("registration_forms")
        .insert(form)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration-forms"] });
      toast.success("Registration form created");
    },
    onError: (error) => {
      toast.error(`Failed to create form: ${error.message}`);
    },
  });
}

export function useUpdateRegistrationForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...form }: TablesUpdate<"registration_forms"> & { id: string }) => {
      const { data, error } = await supabase
        .from("registration_forms")
        .update(form)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["registration-forms"] });
      queryClient.invalidateQueries({ queryKey: ["registration-form", variables.id] });
      toast.success("Registration form updated");
    },
    onError: (error) => {
      toast.error(`Failed to update form: ${error.message}`);
    },
  });
}

export function useDeleteRegistrationForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("registration_forms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registration-forms"] });
      toast.success("Registration form deleted");
    },
    onError: (error) => {
      toast.error(`Failed to delete form: ${error.message}`);
    },
  });
}

export function useSaveFormFields() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formId, fields }: { formId: string; fields: any[] }) => {
      // Delete existing fields
      await supabase.from("registration_form_fields").delete().eq("form_id", formId);

      // Insert new fields
      if (fields.length > 0) {
        const { error } = await supabase.from("registration_form_fields").insert(
          fields.map((field, index) => ({
            form_id: formId,
            field_key: field.field_key,
            field_type: field.field_type,
            label: field.label,
            placeholder: field.placeholder || null,
            help_text: field.help_text || null,
            required: field.required,
            options: field.options ? { items: field.options } : null,
            order_index: index,
          }))
        );

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["registration-forms"] });
      queryClient.invalidateQueries({ queryKey: ["registration-form", variables.formId] });
      toast.success("Form fields saved");
    },
    onError: (error) => {
      toast.error(`Failed to save fields: ${error.message}`);
    },
  });
}

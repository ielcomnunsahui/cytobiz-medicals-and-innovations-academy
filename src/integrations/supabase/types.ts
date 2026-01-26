export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      access_unlocks: {
        Row: {
          cohort_id: string | null
          course_id: string
          created_at: string
          id: string
          reason: string | null
          unlock_type: string
          unlocked_by: string | null
          user_id: string
        }
        Insert: {
          cohort_id?: string | null
          course_id: string
          created_at?: string
          id?: string
          reason?: string | null
          unlock_type: string
          unlocked_by?: string | null
          user_id: string
        }
        Update: {
          cohort_id?: string | null
          course_id?: string
          created_at?: string
          id?: string
          reason?: string | null
          unlock_type?: string
          unlocked_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_unlocks_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_unlocks_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_attempts: {
        Row: {
          answers: Json
          assessment_id: string
          completed_at: string | null
          id: string
          max_score: number
          passed: boolean
          percentage: number
          score: number
          started_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          assessment_id: string
          completed_at?: string | null
          id?: string
          max_score?: number
          passed?: boolean
          percentage?: number
          score?: number
          started_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          assessment_id?: string
          completed_at?: string | null
          id?: string
          max_score?: number
          passed?: boolean
          percentage?: number
          score?: number
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_attempts_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_questions: {
        Row: {
          assessment_id: string
          correct_answer: string
          created_at: string
          id: string
          options: Json
          order_index: number
          points: number
          question_text: string
          question_type: string
        }
        Insert: {
          assessment_id: string
          correct_answer: string
          created_at?: string
          id?: string
          options?: Json
          order_index?: number
          points?: number
          question_text: string
          question_type?: string
        }
        Update: {
          assessment_id?: string
          correct_answer?: string
          created_at?: string
          id?: string
          options?: Json
          order_index?: number
          points?: number
          question_text?: string
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_required: boolean
          module_id: string
          pass_percentage: number
          time_limit_minutes: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean
          module_id: string
          pass_percentage?: number
          time_limit_minutes?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_required?: boolean
          module_id?: string
          pass_percentage?: number
          time_limit_minutes?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          created_at: string
          description: string | null
          due_days: number | null
          id: string
          lesson_id: string
          max_points: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_days?: number | null
          id?: string
          lesson_id: string
          max_points?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_days?: number | null
          id?: string
          lesson_id?: string
          max_points?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificate_payments: {
        Row: {
          amount: number
          cohort_id: string | null
          course_id: string
          created_at: string
          currency: string
          id: string
          paid_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_provider_ref: string | null
          payment_status: string
          receipt_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          cohort_id?: string | null
          course_id: string
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_provider_ref?: string | null
          payment_status?: string
          receipt_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          cohort_id?: string | null
          course_id?: string
          created_at?: string
          currency?: string
          id?: string
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_provider_ref?: string | null
          payment_status?: string
          receipt_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificate_payments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificate_payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          course_id: string
          id: string
          issued_at: string
          user_id: string
          verification_code: string
        }
        Insert: {
          course_id: string
          id?: string
          issued_at?: string
          user_id: string
          verification_code: string
        }
        Update: {
          course_id?: string
          id?: string
          issued_at?: string
          user_id?: string
          verification_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      cohort_access_overrides: {
        Row: {
          assessment_access:
            | Database["public"]["Enums"]["assessment_access_mode"]
            | null
          certificate_access:
            | Database["public"]["Enums"]["certificate_access_mode"]
            | null
          certificate_fee: number | null
          cohort_id: string
          content_access:
            | Database["public"]["Enums"]["content_access_mode"]
            | null
          created_at: string
          id: string
          promo_enabled: boolean | null
          promo_expiry: string | null
          updated_at: string
        }
        Insert: {
          assessment_access?:
            | Database["public"]["Enums"]["assessment_access_mode"]
            | null
          certificate_access?:
            | Database["public"]["Enums"]["certificate_access_mode"]
            | null
          certificate_fee?: number | null
          cohort_id: string
          content_access?:
            | Database["public"]["Enums"]["content_access_mode"]
            | null
          created_at?: string
          id?: string
          promo_enabled?: boolean | null
          promo_expiry?: string | null
          updated_at?: string
        }
        Update: {
          assessment_access?:
            | Database["public"]["Enums"]["assessment_access_mode"]
            | null
          certificate_access?:
            | Database["public"]["Enums"]["certificate_access_mode"]
            | null
          certificate_fee?: number | null
          cohort_id?: string
          content_access?:
            | Database["public"]["Enums"]["content_access_mode"]
            | null
          created_at?: string
          id?: string
          promo_enabled?: boolean | null
          promo_expiry?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohort_access_overrides_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: true
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      cohorts: {
        Row: {
          application_deadline: string | null
          course_id: string
          created_at: string
          created_by: string | null
          end_date: string
          id: string
          is_active: boolean | null
          max_students: number | null
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          course_id: string
          created_at?: string
          created_by?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          max_students?: number | null
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          course_id?: string
          created_at?: string
          created_by?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          max_students?: number | null
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohorts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      content_submissions: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          published_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      course_access_settings: {
        Row: {
          assessment_access: Database["public"]["Enums"]["assessment_access_mode"]
          certificate_access: Database["public"]["Enums"]["certificate_access_mode"]
          certificate_fee: number | null
          content_access: Database["public"]["Enums"]["content_access_mode"]
          course_id: string
          created_at: string
          id: string
          is_legacy: boolean | null
          promo_enabled: boolean | null
          promo_expiry: string | null
          updated_at: string
        }
        Insert: {
          assessment_access?: Database["public"]["Enums"]["assessment_access_mode"]
          certificate_access?: Database["public"]["Enums"]["certificate_access_mode"]
          certificate_fee?: number | null
          content_access?: Database["public"]["Enums"]["content_access_mode"]
          course_id: string
          created_at?: string
          id?: string
          is_legacy?: boolean | null
          promo_enabled?: boolean | null
          promo_expiry?: string | null
          updated_at?: string
        }
        Update: {
          assessment_access?: Database["public"]["Enums"]["assessment_access_mode"]
          certificate_access?: Database["public"]["Enums"]["certificate_access_mode"]
          certificate_fee?: number | null
          content_access?: Database["public"]["Enums"]["content_access_mode"]
          course_id?: string
          created_at?: string
          id?: string
          is_legacy?: boolean | null
          promo_enabled?: boolean | null
          promo_expiry?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_access_settings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: true
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          course_id: string
          created_at: string
          id: string
          is_approved: boolean | null
          rating: number
          review: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          rating: number
          review?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          rating?: number
          review?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          course_type: Database["public"]["Enums"]["course_type"]
          created_at: string
          created_by: string | null
          description: string | null
          discounted_price: number | null
          duration_weeks: number | null
          effort_hours_per_week: number | null
          id: string
          learning_outcomes: string[] | null
          level: string | null
          modules_locked_until_assessment: boolean | null
          original_price: number | null
          prerequisites: string[] | null
          price: number | null
          short_description: string | null
          slug: string
          status: Database["public"]["Enums"]["course_status"]
          target_audience: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          course_type?: Database["public"]["Enums"]["course_type"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          discounted_price?: number | null
          duration_weeks?: number | null
          effort_hours_per_week?: number | null
          id?: string
          learning_outcomes?: string[] | null
          level?: string | null
          modules_locked_until_assessment?: boolean | null
          original_price?: number | null
          prerequisites?: string[] | null
          price?: number | null
          short_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["course_status"]
          target_audience?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          course_type?: Database["public"]["Enums"]["course_type"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          discounted_price?: number | null
          duration_weeks?: number | null
          effort_hours_per_week?: number | null
          id?: string
          learning_outcomes?: string[] | null
          level?: string | null
          modules_locked_until_assessment?: boolean | null
          original_price?: number | null
          prerequisites?: string[] | null
          price?: number | null
          short_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["course_status"]
          target_audience?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          code: string
          course_id: string | null
          created_at: string
          created_by: string | null
          current_uses: number
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          max_uses: number | null
          min_purchase_amount: number | null
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          current_uses?: number
          description?: string | null
          discount_type?: string
          discount_value: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_purchase_amount?: number | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          course_id?: string | null
          created_at?: string
          created_by?: string | null
          current_uses?: number
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_purchase_amount?: number | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_codes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          cohort_id: string | null
          completed_at: string | null
          course_id: string
          discount_amount: number | null
          discount_code_id: string | null
          enrolled_at: string
          id: string
          original_amount: number | null
          payment_amount: number | null
          payment_currency: string
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_provider_ref: string | null
          payment_submitted_at: string | null
          progress_percentage: number | null
          receipt_url: string | null
          registration_submission_id: string | null
          rejected_at: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          cohort_id?: string | null
          completed_at?: string | null
          course_id: string
          discount_amount?: number | null
          discount_code_id?: string | null
          enrolled_at?: string
          id?: string
          original_amount?: number | null
          payment_amount?: number | null
          payment_currency?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_provider_ref?: string | null
          payment_submitted_at?: string | null
          progress_percentage?: number | null
          receipt_url?: string | null
          registration_submission_id?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          cohort_id?: string | null
          completed_at?: string | null
          course_id?: string
          discount_amount?: number | null
          discount_code_id?: string | null
          enrolled_at?: string
          id?: string
          original_amount?: number | null
          payment_amount?: number | null
          payment_currency?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_provider_ref?: string | null
          payment_submitted_at?: string | null
          progress_percentage?: number | null
          receipt_url?: string | null
          registration_submission_id?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_discount_code_id_fkey"
            columns: ["discount_code_id"]
            isOneToOne: false
            referencedRelation: "discount_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_registration_submission_id_fkey"
            columns: ["registration_submission_id"]
            isOneToOne: false
            referencedRelation: "registration_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendance: {
        Row: {
          check_in_method: string | null
          checked_in_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          check_in_method?: string | null
          checked_in_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          check_in_method?: string | null
          checked_in_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          event_date: string
          id: string
          image_url: string | null
          location: string | null
          max_attendees: number | null
          registration_required: boolean
          status: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          location?: string | null
          max_attendees?: number | null
          registration_required?: boolean
          status?: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          location?: string | null
          max_attendees?: number | null
          registration_required?: boolean
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      facilitator_cohorts: {
        Row: {
          cohort_id: string
          created_at: string
          facilitator_id: string
          id: string
        }
        Insert: {
          cohort_id: string
          created_at?: string
          facilitator_id: string
          id?: string
        }
        Update: {
          cohort_id?: string
          created_at?: string
          facilitator_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facilitator_cohorts_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      facilitators: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_order: number | null
          expertise: string[] | null
          id: string
          linkedin_url: string | null
          name: string
          title: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_order?: number | null
          expertise?: string[] | null
          id?: string
          linkedin_url?: string | null
          name: string
          title?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_order?: number | null
          expertise?: string[] | null
          id?: string
          linkedin_url?: string | null
          name?: string
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          course_id: string | null
          created_at: string
          id: string
          is_global: boolean | null
          order_index: number | null
          question: string
        }
        Insert: {
          answer: string
          course_id?: string | null
          created_at?: string
          id?: string
          is_global?: boolean | null
          order_index?: number | null
          question: string
        }
        Update: {
          answer?: string
          course_id?: string | null
          created_at?: string
          id?: string
          is_global?: boolean | null
          order_index?: number | null
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "faqs_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      freshers_guidelines: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          order_index: number
          section_title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          section_title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          section_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      legislatives: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          document_url: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_url?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_url?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          created_at: string
          document_url: string | null
          duration_minutes: number | null
          external_url: string | null
          id: string
          is_free_preview: boolean | null
          lesson_type: string | null
          module_id: string
          order_index: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          document_url?: string | null
          duration_minutes?: number | null
          external_url?: string | null
          id?: string
          is_free_preview?: boolean | null
          lesson_type?: string | null
          module_id: string
          order_index?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          document_url?: string | null
          duration_minutes?: number | null
          external_url?: string | null
          id?: string
          is_free_preview?: boolean | null
          lesson_type?: string | null
          module_id?: string
          order_index?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          price: number
          seller_id: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          whatsapp_number: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          price?: number
          seller_id: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          whatsapp_number: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          price?: number
          seller_id?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      official_links: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          is_active: boolean
          order_index: number
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean
          order_index?: number
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          is_active?: boolean
          order_index?: number
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      platform_access_defaults: {
        Row: {
          assessment_access: Database["public"]["Enums"]["assessment_access_mode"]
          certificate_access: Database["public"]["Enums"]["certificate_access_mode"]
          content_access: Database["public"]["Enums"]["content_access_mode"]
          default_certificate_fee: number | null
          id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          assessment_access?: Database["public"]["Enums"]["assessment_access_mode"]
          certificate_access?: Database["public"]["Enums"]["certificate_access_mode"]
          content_access?: Database["public"]["Enums"]["content_access_mode"]
          default_certificate_fee?: number | null
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          assessment_access?: Database["public"]["Enums"]["assessment_access_mode"]
          certificate_access?: Database["public"]["Enums"]["certificate_access_mode"]
          content_access?: Database["public"]["Enums"]["content_access_mode"]
          default_certificate_fee?: number | null
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          matric_number: string | null
          phone: string | null
          receipt_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          matric_number?: string | null
          phone?: string | null
          receipt_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          matric_number?: string | null
          phone?: string | null
          receipt_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      registration_form_fields: {
        Row: {
          created_at: string
          field_key: string
          field_type: Database["public"]["Enums"]["form_field_type"]
          form_id: string
          help_text: string | null
          id: string
          label: string
          options: Json | null
          order_index: number
          placeholder: string | null
          required: boolean
          updated_at: string
          validation: Json | null
        }
        Insert: {
          created_at?: string
          field_key: string
          field_type?: Database["public"]["Enums"]["form_field_type"]
          form_id: string
          help_text?: string | null
          id?: string
          label: string
          options?: Json | null
          order_index?: number
          placeholder?: string | null
          required?: boolean
          updated_at?: string
          validation?: Json | null
        }
        Update: {
          created_at?: string
          field_key?: string
          field_type?: Database["public"]["Enums"]["form_field_type"]
          form_id?: string
          help_text?: string | null
          id?: string
          label?: string
          options?: Json | null
          order_index?: number
          placeholder?: string | null
          required?: boolean
          updated_at?: string
          validation?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "registration_form_fields_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "registration_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_forms: {
        Row: {
          course_id: string | null
          course_type: Database["public"]["Enums"]["course_type"] | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          course_id?: string | null
          course_type?: Database["public"]["Enums"]["course_type"] | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          course_id?: string | null
          course_type?: Database["public"]["Enums"]["course_type"] | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      registration_submissions: {
        Row: {
          cohort_id: string | null
          course_id: string
          created_at: string
          data: Json
          form_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cohort_id?: string | null
          course_id: string
          created_at?: string
          data?: Json
          form_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cohort_id?: string | null
          course_id?: string
          created_at?: string
          data?: Json
          form_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registration_submissions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "registration_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      research: {
        Row: {
          abstract: string | null
          authors: string[] | null
          category: string | null
          created_at: string
          created_by: string | null
          document_url: string | null
          id: string
          is_active: boolean
          published_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          abstract?: string | null
          authors?: string[] | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          document_url?: string | null
          id?: string
          is_active?: boolean
          published_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          abstract?: string | null
          authors?: string[] | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          document_url?: string | null
          id?: string
          is_active?: boolean
          published_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_type: string
          setting_value: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          assignment_id: string
          content: string | null
          feedback: string | null
          file_url: string | null
          grade: number | null
          graded_at: string | null
          graded_by: string | null
          id: string
          learner_id: string
          submitted_at: string
        }
        Insert: {
          assignment_id: string
          content?: string | null
          feedback?: string | null
          file_url?: string | null
          grade?: number | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          learner_id: string
          submitted_at?: string
        }
        Update: {
          assignment_id?: string
          content?: string | null
          feedback?: string | null
          file_url?: string | null
          grade?: number | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          learner_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      success_stories: {
        Row: {
          company: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          linkedin_url: string | null
          name: string
          outcome: string | null
          project_description: string | null
          project_name: string | null
          rating: number | null
          testimonial: string
          title: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          linkedin_url?: string | null
          name: string
          outcome?: string | null
          project_description?: string | null
          project_name?: string | null
          rating?: number | null
          testimonial: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          linkedin_url?: string | null
          name?: string
          outcome?: string | null
          project_description?: string | null
          project_name?: string | null
          rating?: number | null
          testimonial?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          course_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_course_access_settings: {
        Args: { _cohort_id?: string; _course_id: string }
        Returns: {
          assessment_access: Database["public"]["Enums"]["assessment_access_mode"]
          certificate_access: Database["public"]["Enums"]["certificate_access_mode"]
          certificate_fee: number
          content_access: Database["public"]["Enums"]["content_access_mode"]
          is_legacy: boolean
          promo_enabled: boolean
          promo_expiry: string
        }[]
      }
      has_access_unlock: {
        Args: { _course_id: string; _unlock_type: string; _user_id: string }
        Returns: boolean
      }
      has_paid_certificate: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      has_passed_module_assessment: {
        Args: { _module_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_enrolled_in_course: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      is_facilitator_for_course: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      is_within_cohort_window: {
        Args: { _cohort_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "facilitator" | "learner"
      assessment_access_mode: "free" | "paid" | "locked"
      certificate_access_mode: "free" | "paid" | "disabled"
      content_access_mode: "free" | "paid_before_access"
      content_status: "pending" | "approved" | "rejected"
      course_status: "draft" | "published" | "archived"
      course_type: "cohort" | "self_paced"
      enrollment_status: "pending" | "confirmed" | "rejected"
      event_status: "upcoming" | "ongoing" | "completed" | "cancelled"
      form_field_type:
        | "text"
        | "textarea"
        | "email"
        | "phone"
        | "number"
        | "select"
        | "multiselect"
        | "checkbox"
      payment_method: "stripe" | "paystack" | "bank_transfer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "facilitator", "learner"],
      assessment_access_mode: ["free", "paid", "locked"],
      certificate_access_mode: ["free", "paid", "disabled"],
      content_access_mode: ["free", "paid_before_access"],
      content_status: ["pending", "approved", "rejected"],
      course_status: ["draft", "published", "archived"],
      course_type: ["cohort", "self_paced"],
      enrollment_status: ["pending", "confirmed", "rejected"],
      event_status: ["upcoming", "ongoing", "completed", "cancelled"],
      form_field_type: [
        "text",
        "textarea",
        "email",
        "phone",
        "number",
        "select",
        "multiselect",
        "checkbox",
      ],
      payment_method: ["stripe", "paystack", "bank_transfer"],
    },
  },
} as const

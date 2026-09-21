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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          assigned_to: string | null
          attachment_path: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          internal_note: string | null
          message: string
          name: string
          phone: string
          project_type: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          attachment_path?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          internal_note?: string | null
          message: string
          name: string
          phone: string
          project_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          attachment_path?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          internal_note?: string | null
          message?: string
          name?: string
          phone?: string
          project_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      delivery_jobs: {
        Row: {
          budget_kes: number
          client_name: string | null
          contract_value_kes: number
          created_at: string
          id: string
          invoiced_kes: number
          job_code: string
          job_type: string | null
          location: string | null
          notes: string | null
          owner_name: string | null
          project_id: string | null
          quote_request_id: string | null
          received_kes: number
          spent_kes: number
          start_date: string | null
          status: Database["public"]["Enums"]["job_status"]
          target_end_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_kes?: number
          client_name?: string | null
          contract_value_kes?: number
          created_at?: string
          id?: string
          invoiced_kes?: number
          job_code?: string
          job_type?: string | null
          location?: string | null
          notes?: string | null
          owner_name?: string | null
          project_id?: string | null
          quote_request_id?: string | null
          received_kes?: number
          spent_kes?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          target_end_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_kes?: number
          client_name?: string | null
          contract_value_kes?: number
          created_at?: string
          id?: string
          invoiced_kes?: number
          job_code?: string
          job_type?: string | null
          location?: string | null
          notes?: string | null
          owner_name?: string | null
          project_id?: string | null
          quote_request_id?: string | null
          received_kes?: number
          spent_kes?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          target_end_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_jobs_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_tasks: {
        Row: {
          created_at: string
          days_required: number
          id: string
          job_id: string
          name: string
          notes: string | null
          progress: number
          responsible: string | null
          sort_order: number
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          days_required?: number
          id?: string
          job_id: string
          name: string
          notes?: string | null
          progress?: number
          responsible?: string | null
          sort_order?: number
          start_date?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          days_required?: number
          id?: string
          job_id?: string
          name?: string
          notes?: string | null
          progress?: number
          responsible?: string | null
          sort_order?: number
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_tasks_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "delivery_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total_kes: number
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price_kes: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total_kes?: number
          order_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          unit_price_kes?: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total_kes?: number
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price_kes?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          county: string | null
          created_at: string
          customer_name: string
          customer_note: string | null
          delivery_address: string
          delivery_fee_kes: number
          email: string | null
          id: string
          internal_note: string | null
          items_total_kes: number
          order_no: string
          payment_provider: string | null
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string
          provider_request_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_kes: number
          updated_at: string
        }
        Insert: {
          county?: string | null
          created_at?: string
          customer_name: string
          customer_note?: string | null
          delivery_address: string
          delivery_fee_kes?: number
          email?: string | null
          id?: string
          internal_note?: string | null
          items_total_kes?: number
          order_no?: string
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone: string
          provider_request_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_kes?: number
          updated_at?: string
        }
        Update: {
          county?: string | null
          created_at?: string
          customer_name?: string
          customer_note?: string | null
          delivery_address?: string
          delivery_fee_kes?: number
          email?: string | null
          id?: string
          internal_note?: string | null
          items_total_kes?: number
          order_no?: string
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string
          provider_request_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_kes?: number
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          body: string
          category: Database["public"]["Enums"]["post_category"]
          cover_url: string | null
          created_at: string
          excerpt: string
          id: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string
          category?: Database["public"]["Enums"]["post_category"]
          cover_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          category?: Database["public"]["Enums"]["post_category"]
          cover_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean
          is_active: boolean
          name: string
          price_kes: number | null
          slug: string
          sort_order: number
          spec: string | null
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean
          is_active?: boolean
          name: string
          price_kes?: number | null
          slug: string
          sort_order?: number
          spec?: string | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean
          is_active?: boolean
          name?: string
          price_kes?: number | null
          slug?: string
          sort_order?: number
          spec?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          body: string
          capacity: string | null
          category: Database["public"]["Enums"]["project_category"]
          client_name: string | null
          completion_date: string | null
          cover_url: string | null
          created_at: string
          featured: boolean
          gallery_urls: string[]
          id: string
          location: string | null
          pdf_path: string | null
          scope: string | null
          sector: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["post_status"]
          summary: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          capacity?: string | null
          category?: Database["public"]["Enums"]["project_category"]
          client_name?: string | null
          completion_date?: string | null
          cover_url?: string | null
          created_at?: string
          featured?: boolean
          gallery_urls?: string[]
          id?: string
          location?: string | null
          pdf_path?: string | null
          scope?: string | null
          sector?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["post_status"]
          summary?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          capacity?: string | null
          category?: Database["public"]["Enums"]["project_category"]
          client_name?: string | null
          completion_date?: string | null
          cover_url?: string | null
          created_at?: string
          featured?: boolean
          gallery_urls?: string[]
          id?: string
          location?: string | null
          pdf_path?: string | null
          scope?: string | null
          sector?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["post_status"]
          summary?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          appliances: string | null
          building_type: string
          company: string | null
          contact_name: string
          created_at: string
          email: string
          estimate_high_kes: number | null
          estimate_low_kes: number | null
          id: string
          internal_note: string | null
          location: string
          notes: string | null
          phone: string
          reference: string
          status: Database["public"]["Enums"]["quote_status"]
          supply_type: string
          timeline: string | null
          units: number
          updated_at: string
        }
        Insert: {
          appliances?: string | null
          building_type: string
          company?: string | null
          contact_name: string
          created_at?: string
          email: string
          estimate_high_kes?: number | null
          estimate_low_kes?: number | null
          id?: string
          internal_note?: string | null
          location: string
          notes?: string | null
          phone: string
          reference?: string
          status?: Database["public"]["Enums"]["quote_status"]
          supply_type?: string
          timeline?: string | null
          units?: number
          updated_at?: string
        }
        Update: {
          appliances?: string | null
          building_type?: string
          company?: string | null
          contact_name?: string
          created_at?: string
          email?: string
          estimate_high_kes?: number | null
          estimate_low_kes?: number | null
          id?: string
          internal_note?: string | null
          location?: string
          notes?: string | null
          phone?: string
          reference?: string
          status?: Database["public"]["Enums"]["quote_status"]
          supply_type?: string
          timeline?: string | null
          units?: number
          updated_at?: string
        }
        Relationships: []
      }
      sms_log: {
        Row: {
          body: string
          created_at: string
          delivered: boolean
          error: string | null
          id: string
          order_id: string | null
          phone: string
          provider: string | null
          template: string
        }
        Insert: {
          body: string
          created_at?: string
          delivered?: boolean
          error?: string | null
          id?: string
          order_id?: string | null
          phone: string
          provider?: string | null
          template: string
        }
        Update: {
          body?: string
          created_at?: string
          delivered?: boolean
          error?: string | null
          id?: string
          order_id?: string | null
          phone?: string
          provider?: string | null
          template?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
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
          role: Database["public"]["Enums"]["app_role"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "staff"
      job_status: "planning" | "active" | "on_hold" | "complete" | "cancelled"
      order_status:
        | "new"
        | "confirmed"
        | "dispatched"
        | "delivered"
        | "cancelled"
      payment_status: "pending" | "paid" | "failed"
      post_category: "news" | "blog"
      post_status: "draft" | "published"
      product_category:
        | "pipes"
        | "regulators"
        | "fireplaces"
        | "cylinders"
        | "safety"
        | "other"
      project_category:
        | "reticulation"
        | "storage"
        | "safety"
        | "metering"
        | "maintenance"
        | "other"
      quote_status: "new" | "reviewing" | "quoted" | "won" | "lost"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "staff"],
      job_status: ["planning", "active", "on_hold", "complete", "cancelled"],
      order_status: [
        "new",
        "confirmed",
        "dispatched",
        "delivered",
        "cancelled",
      ],
      payment_status: ["pending", "paid", "failed"],
      post_category: ["news", "blog"],
      post_status: ["draft", "published"],
      product_category: [
        "pipes",
        "regulators",
        "fireplaces",
        "cylinders",
        "safety",
        "other",
      ],
      project_category: [
        "reticulation",
        "storage",
        "safety",
        "metering",
        "maintenance",
        "other",
      ],
      quote_status: ["new", "reviewing", "quoted", "won", "lost"],
    },
  },
} as const

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
      ebk_rates: {
        Row: {
          category: string
          daily_kes: number
          description: string
          hourly_kes: number
          monthly_kes: number
          source: string
          updated_at: string
        }
        Insert: {
          category: string
          daily_kes: number
          description: string
          hourly_kes: number
          monthly_kes: number
          source?: string
          updated_at?: string
        }
        Update: {
          category?: string
          daily_kes?: number
          description?: string
          hourly_kes?: number
          monthly_kes?: number
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      ebk_stages: {
        Row: {
          code: string
          label: string
          pct: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          label: string
          pct: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          label?: string
          pct?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      eng_quote_items: {
        Row: {
          created_at: string
          description: string
          id: string
          product_id: string | null
          qty: number
          quote_id: string
          section: string
          sort_order: number
          unit: string
          unit_cost_kes: number | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          product_id?: string | null
          qty?: number
          quote_id: string
          section?: string
          sort_order?: number
          unit?: string
          unit_cost_kes?: number | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          product_id?: string | null
          qty?: number
          quote_id?: string
          section?: string
          sort_order?: number
          unit?: string
          unit_cost_kes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eng_quote_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eng_quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "eng_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      eng_quote_notifications: {
        Row: {
          channel: string
          created_at: string
          delivered: boolean
          error: string | null
          id: string
          quote_id: string
          recipient: string
          revision: number
        }
        Insert: {
          channel: string
          created_at?: string
          delivered?: boolean
          error?: string | null
          id?: string
          quote_id: string
          recipient: string
          revision: number
        }
        Update: {
          channel?: string
          created_at?: string
          delivered?: boolean
          error?: string | null
          id?: string
          quote_id?: string
          recipient?: string
          revision?: number
        }
        Relationships: [
          {
            foreignKeyName: "eng_quote_notifications_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "eng_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      eng_quote_revisions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          quote_id: string
          revision: number
          snapshot: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          quote_id: string
          revision: number
          snapshot: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          quote_id?: string
          revision?: number
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "eng_quote_revisions_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "eng_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      eng_quotes: {
        Row: {
          approved_at: string | null
          assumptions: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          cost_total_kes: number
          costs: Json
          created_at: string
          estimator_id: string | null
          exclusions: string | null
          id: string
          inputs: Json
          issued_at: string | null
          location: string | null
          margin_pct: number
          monthly_service_kes: number
          payment_terms: string | null
          project_id: string | null
          project_name: string | null
          public_token: string
          quote_class: string
          quote_no: string
          quote_request_id: string | null
          reviewer_id: string | null
          revision: number
          risk: string
          sell_subtotal_kes: number
          status: string
          total_kes: number
          updated_at: string
          validity_days: number
          vat_kes: number
          warnings: Json
        }
        Insert: {
          approved_at?: string | null
          assumptions?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          cost_total_kes?: number
          costs?: Json
          created_at?: string
          estimator_id?: string | null
          exclusions?: string | null
          id?: string
          inputs?: Json
          issued_at?: string | null
          location?: string | null
          margin_pct?: number
          monthly_service_kes?: number
          payment_terms?: string | null
          project_id?: string | null
          project_name?: string | null
          public_token?: string
          quote_class: string
          quote_no?: string
          quote_request_id?: string | null
          reviewer_id?: string | null
          revision?: number
          risk?: string
          sell_subtotal_kes?: number
          status?: string
          total_kes?: number
          updated_at?: string
          validity_days?: number
          vat_kes?: number
          warnings?: Json
        }
        Update: {
          approved_at?: string | null
          assumptions?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          cost_total_kes?: number
          costs?: Json
          created_at?: string
          estimator_id?: string | null
          exclusions?: string | null
          id?: string
          inputs?: Json
          issued_at?: string | null
          location?: string | null
          margin_pct?: number
          monthly_service_kes?: number
          payment_terms?: string | null
          project_id?: string | null
          project_name?: string | null
          public_token?: string
          quote_class?: string
          quote_no?: string
          quote_request_id?: string | null
          reviewer_id?: string | null
          revision?: number
          risk?: string
          sell_subtotal_kes?: number
          status?: string
          total_kes?: number
          updated_at?: string
          validity_days?: number
          vat_kes?: number
          warnings?: Json
        }
        Relationships: [
          {
            foreignKeyName: "eng_quotes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eng_quotes_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_leads: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          interest_area: string | null
          internal_note: string | null
          investor_type: string
          message: string | null
          nda_accepted_at: string
          nda_version: string
          organisation: string | null
          phone: string | null
          reference: string
          role_title: string | null
          status: Database["public"]["Enums"]["investor_lead_status"]
          ticket_band: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          interest_area?: string | null
          internal_note?: string | null
          investor_type?: string
          message?: string | null
          nda_accepted_at?: string
          nda_version?: string
          organisation?: string | null
          phone?: string | null
          reference?: string
          role_title?: string | null
          status?: Database["public"]["Enums"]["investor_lead_status"]
          ticket_band?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          interest_area?: string | null
          internal_note?: string | null
          investor_type?: string
          message?: string | null
          nda_accepted_at?: string
          nda_version?: string
          organisation?: string | null
          phone?: string | null
          reference?: string
          role_title?: string | null
          status?: Database["public"]["Enums"]["investor_lead_status"]
          ticket_band?: string | null
          updated_at?: string
        }
        Relationships: []
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
          brand: string | null
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          default_margin_pct: number | null
          description: string | null
          hs_code: string | null
          id: string
          image_url: string | null
          in_stock: boolean
          is_active: boolean
          kra_tax_category: string | null
          landed_cost_kes: number | null
          lead_time_days: number | null
          min_price_kes: number | null
          name: string
          price_kes: number | null
          price_valid_until: string | null
          procurement_cost_kes: number | null
          quote_eligible: boolean
          quote_only: boolean
          sku: string | null
          slug: string
          sort_order: number
          spec: string | null
          supplier_name: string | null
          unit: string
          unspsc_code: string | null
          updated_at: string
          vat_rated: boolean
        }
        Insert: {
          brand?: string | null
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          default_margin_pct?: number | null
          description?: string | null
          hs_code?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean
          is_active?: boolean
          kra_tax_category?: string | null
          landed_cost_kes?: number | null
          lead_time_days?: number | null
          min_price_kes?: number | null
          name: string
          price_kes?: number | null
          price_valid_until?: string | null
          procurement_cost_kes?: number | null
          quote_eligible?: boolean
          quote_only?: boolean
          sku?: string | null
          slug: string
          sort_order?: number
          spec?: string | null
          supplier_name?: string | null
          unit?: string
          unspsc_code?: string | null
          updated_at?: string
          vat_rated?: boolean
        }
        Update: {
          brand?: string | null
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          default_margin_pct?: number | null
          description?: string | null
          hs_code?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean
          is_active?: boolean
          kra_tax_category?: string | null
          landed_cost_kes?: number | null
          lead_time_days?: number | null
          min_price_kes?: number | null
          name?: string
          price_kes?: number | null
          price_valid_until?: string | null
          procurement_cost_kes?: number | null
          quote_eligible?: boolean
          quote_only?: boolean
          sku?: string | null
          slug?: string
          sort_order?: number
          spec?: string | null
          supplier_name?: string | null
          unit?: string
          unspsc_code?: string | null
          updated_at?: string
          vat_rated?: boolean
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
      quote_settings: {
        Row: {
          contingency_high_pct: number
          contingency_low_pct: number
          contingency_medium_pct: number
          default_assumptions: string
          default_exclusions: string
          default_payment_terms: string
          ebk_mech_max_pct: number
          ebk_mech_min_pct: number
          engineer_hour_kes: number | null
          id: number
          labour_day_kes: number | null
          labour_hour_kes: number | null
          min_margin_pct: number
          overhead_pct: number
          quote_only_threshold_kes: number
          target_margin_pct: number
          transport_km_kes: number | null
          updated_at: string
          validity_days: number
          vat_pct: number
        }
        Insert: {
          contingency_high_pct?: number
          contingency_low_pct?: number
          contingency_medium_pct?: number
          default_assumptions?: string
          default_exclusions?: string
          default_payment_terms?: string
          ebk_mech_max_pct?: number
          ebk_mech_min_pct?: number
          engineer_hour_kes?: number | null
          id?: number
          labour_day_kes?: number | null
          labour_hour_kes?: number | null
          min_margin_pct?: number
          overhead_pct?: number
          quote_only_threshold_kes?: number
          target_margin_pct?: number
          transport_km_kes?: number | null
          updated_at?: string
          validity_days?: number
          vat_pct?: number
        }
        Update: {
          contingency_high_pct?: number
          contingency_low_pct?: number
          contingency_medium_pct?: number
          default_assumptions?: string
          default_exclusions?: string
          default_payment_terms?: string
          ebk_mech_max_pct?: number
          ebk_mech_min_pct?: number
          engineer_hour_kes?: number | null
          id?: number
          labour_day_kes?: number | null
          labour_hour_kes?: number | null
          min_margin_pct?: number
          overhead_pct?: number
          quote_only_threshold_kes?: number
          target_margin_pct?: number
          transport_km_kes?: number | null
          updated_at?: string
          validity_days?: number
          vat_pct?: number
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
      suppliers: {
        Row: {
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
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
      investor_lead_status:
        | "new"
        | "reviewing"
        | "nda_signed"
        | "access_granted"
        | "declined"
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
      investor_lead_status: [
        "new",
        "reviewing",
        "nda_signed",
        "access_granted",
        "declined",
      ],
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

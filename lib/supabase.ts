import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      borrowers: {
        Row: {
          id: string
          name: string
          business: string
          loan_amount: number
          status: 'pending' | 'approved' | 'rejected'
          credit_score: number
          ai_score: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          business: string
          loan_amount: number
          status?: 'pending' | 'approved' | 'rejected'
          credit_score?: number
          ai_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          business?: string
          loan_amount?: number
          status?: 'pending' | 'approved' | 'rejected'
          credit_score?: number
          ai_score?: number
          created_at?: string
        }
      }
      field_agents: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          status: 'active' | 'inactive'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          status?: 'active' | 'inactive'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          status?: 'active' | 'inactive'
          created_at?: string
        }
      }
      visits: {
        Row: {
          id: string
          borrower_id: string
          agent_id: string
          scheduled_date: string
          status: 'scheduled' | 'completed' | 'cancelled'
          priority: 'high' | 'medium' | 'low'
          notes: string
          created_at: string
        }
        Insert: {
          id?: string
          borrower_id: string
          agent_id: string
          scheduled_date: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          priority?: 'high' | 'medium' | 'low'
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          borrower_id?: string
          agent_id?: string
          scheduled_date?: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          priority?: 'high' | 'medium' | 'low'
          notes?: string
          created_at?: string
        }
      }
    }
  }
}
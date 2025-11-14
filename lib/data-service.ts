import { supabase, Database } from './supabase'

type Borrower = Database['public']['Tables']['borrowers']['Row']
type BorrowerInsert = Database['public']['Tables']['borrowers']['Insert']
type FieldAgent = Database['public']['Tables']['field_agents']['Row']
type Visit = Database['public']['Tables']['visits']['Row']

// Borrowers service
export const borrowersService = {
  async getAll() {
    const { data, error } = await supabase
      .from('borrowers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Borrower[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('borrowers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Borrower
  },

  async create(borrower: BorrowerInsert) {
    const { data, error } = await supabase
      .from('borrowers')
      .insert(borrower)
      .select()
      .single()

    if (error) throw error
    return data as Borrower
  },

  async update(id: string, updates: Partial<Borrower>) {
    const { data, error } = await supabase
      .from('borrowers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Borrower
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('borrowers')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Field agents service
export const fieldAgentsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('field_agents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as FieldAgent[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('field_agents')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as FieldAgent
  }
}

// Visits service
export const visitsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        borrower:borrowers(name, business, status),
        agent:field_agents(name)
      `)
      .order('scheduled_date', { ascending: true })

    if (error) throw error
    return data as (Visit & { borrower: { name: string; business: string; status: string }, agent: { name: string } })[]
  },

  async getByAgentId(agentId: string) {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        borrower:borrowers(name, business, status)
      `)
      .eq('agent_id', agentId)
      .order('scheduled_date', { ascending: true })

    if (error) throw error
    return data as (Visit & { borrower: { name: string; business: string; status: string } })[]
  },

  async create(visit: Database['public']['Tables']['visits']['Insert']) {
    const { data, error } = await supabase
      .from('visits')
      .insert(visit)
      .select()
      .single()

    if (error) throw error
    return data as Visit
  },

  async update(id: string, updates: Partial<Visit>) {
    const { data, error } = await supabase
      .from('visits')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Visit
  }
}

// Dashboard stats service
export const dashboardService = {
  async getStats() {
    const [borrowersCount, approvedCount, pendingCount, visitsCount] = await Promise.all([
      supabase.from('borrowers').select('*', { count: 'exact', head: true }),
      supabase.from('borrowers').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('borrowers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('visits').select('*', { count: 'exact', head: true }).eq('status', 'scheduled')
    ])

    return {
      totalBorrowers: borrowersCount.count || 0,
      approvedLoans: approvedCount.count || 0,
      pendingApplications: pendingCount.count || 0,
      scheduledVisits: visitsCount.count || 0
    }
  },

  async getRecentBorrowers() {
    const { data, error } = await supabase
      .from('borrowers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error
    return data as Borrower[]
  }
}

// Insights service
export const insightsService = {
  async getAIInsights() {
    const { data: borrowers, error } = await supabase
      .from('borrowers')
      .select('*')

    if (error) throw error

    const total = borrowers?.length || 0
    const withAIScore = borrowers?.filter(b => b.ai_score && b.ai_score > 0).length || 0
    const highCreditScore = borrowers?.filter(b => b.credit_score && b.credit_score >= 700).length || 0
    const approved = borrowers?.filter(b => b.status === 'approved').length || 0
    const pending = borrowers?.filter(b => b.status === 'pending').length || 0
    const aiImprovement = borrowers?.filter(b =>
      b.ai_score && b.credit_score && b.ai_score > b.credit_score
    ).length || 0

    return {
      aiInsights: [
        {
          type: "vision",
          title: "AI Score Coverage",
          description: `${Math.round((withAIScore / total) * 100)}% of borrowers have AI credit scores`,
          impact: "positive" as const,
          count: withAIScore
        },
        {
          type: "nlp",
          title: "Credit Score Analysis",
          description: `${Math.round((highCreditScore / total) * 100)}% of borrowers maintain good credit standing (700+)`,
          impact: "positive" as const,
          count: highCreditScore
        },
        {
          type: "risk",
          title: "Pending Applications",
          description: `${pending} applications awaiting AI analysis and review`,
          impact: pending > total * 0.3 ? "negative" as const : "neutral" as const,
          count: pending
        },
        {
          type: "trend",
          title: "AI Score Improvement",
          description: `${Math.round((aiImprovement / total) * 100)}% of borrowers received higher scores through AI analysis`,
          impact: "positive" as const,
          count: aiImprovement
        }
      ],
      performanceMetrics: {
        approvalRate: approved > 0 ? Math.round((approved / total) * 100) : 0,
        aiCoverage: withAIScore > 0 ? Math.round((withAIScore / total) * 100) : 0,
        totalBorrowers: total,
        avgAIScore: borrowers?.reduce((sum, b) => sum + (b.ai_score || 0), 0) / total || 0
      }
    }
  },

  async getVisitStats() {
    const { data: visits, error } = await supabase
      .from('visits')
      .select('*')

    if (error) throw error

    const total = visits?.length || 0
    const completed = visits?.filter(v => v.status === 'completed').length || 0
    const scheduled = visits?.filter(v => v.status === 'scheduled').length || 0
    const withNotes = visits?.filter(v => v.notes && v.notes.length > 0).length || 0

    return {
      totalVisits: total,
      completed,
      scheduled,
      withNotes,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }
}
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
    return data as FieldAgent[]
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

  async create(visit: Omit<Database['public']['Tables']['visits']['Insert'], 'id'>) {
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
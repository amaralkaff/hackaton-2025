import { Database } from './database.types'

type Borrower = Database['public']['Tables']['borrowers']['Row']
type Visit = Database['public']['Tables']['visits']['Row']
type FieldAgent = Database['public']['Tables']['field_agents']['Row']

// Convert data to CSV format
export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
  headers?: string[]
): string {
  if (data.length === 0) return ''

  const keys = headers || Object.keys(data[0])
  const csvHeaders = keys.join(',')

  const csvRows = data.map(row => {
    return keys.map(key => {
      const value = row[key]
      // Handle null, undefined, and special characters
      if (value === null || value === undefined) return ''
      const stringValue = String(value)
      // Escape quotes and wrap in quotes if contains comma or quote
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(',')
  })

  return [csvHeaders, ...csvRows].join('\n')
}

// Download CSV file
export function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

// Export borrowers to CSV
export function exportBorrowersToCSV(borrowers: Borrower[]) {
  const csv = convertToCSV(borrowers, [
    'id',
    'name',
    'email',
    'phone',
    'business',
    'location',
    'loan_amount',
    'credit_score',
    'ai_score',
    'risk_level',
    'status',
    'created_at',
    'updated_at'
  ])

  const filename = `borrowers_${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}

// Export field agent visits to CSV
export function exportVisitsToCSV(visits: Visit[], agents: FieldAgent[]) {
  const agentMap = new Map(agents.map(a => [a.id, a.name]))

  const enrichedVisits = visits.map(visit => {
    const extendedVisit = visit as Visit & { purpose?: string; photo_urls?: string[] }
    return {
      id: extendedVisit.id,
      agent_name: agentMap.get(extendedVisit.agent_id) || extendedVisit.agent_id,
      borrower_id: extendedVisit.borrower_id,
      visit_date: extendedVisit.scheduled_date,
      status: extendedVisit.status,
      purpose: extendedVisit.purpose || '',
      notes: extendedVisit.notes || '',
      photo_urls: extendedVisit.photo_urls?.join('; ') || '',
      created_at: extendedVisit.created_at,
      updated_at: extendedVisit.updated_at
    }
  })

  const csv = convertToCSV(enrichedVisits)
  const filename = `field_visits_${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}

// Parse CSV file
export async function parseCSV<T = Record<string, string | null>>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())

        if (lines.length === 0) {
          resolve([])
          return
        }

        const headers = lines[0].split(',').map(h => h.trim())
        const data: T[] = []

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim())
          const obj: Record<string, string | null> = {}

          headers.forEach((header, index) => {
            obj[header] = values[index] || null
          })

          data.push(obj as T)
        }

        resolve(data)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

// Generate simple text report
export function generateTextReport(title: string, sections: { title: string; content: string }[]): string {
  let report = `${title}\n`
  report += `Generated: ${new Date().toLocaleString()}\n`
  report += '='.repeat(80) + '\n\n'

  sections.forEach(section => {
    report += `${section.title}\n`
    report += '-'.repeat(section.title.length) + '\n'
    report += section.content + '\n\n'
  })

  return report
}

// Download text file
export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

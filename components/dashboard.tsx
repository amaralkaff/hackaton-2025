"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table"
import {
  FileText,
  Camera,
  Calculator,
  TrendingUp,
  Users,
  CheckCircle,
  Clock
} from "lucide-react"
import { borrowersService, dashboardService } from "@/lib/data-service"
import { Database } from "@/lib/database.types"

type BorrowerRow = Database['public']['Tables']['borrowers']['Row']
type Borrower = BorrowerRow & {
  risk_level?: string
}

// Helper functions - defined before columns to avoid reference errors
const getScoreColor = (score: number) => {
  if (score >= 700) return "text-chart-1"
  if (score >= 600) return "text-chart-3"
  return "text-destructive"
}

const getRiskBadge = (riskLevel: string | null | undefined) => {
  if (!riskLevel) return <Badge variant="outline">N/A</Badge>

  switch (riskLevel) {
    case 'low':
      return <Badge variant="default" className="bg-chart-1 text-primary-foreground">Low</Badge>
    case 'medium':
      return <Badge variant="default" className="bg-chart-3 text-primary-foreground">Medium</Badge>
    case 'high':
      return <Badge variant="destructive">High</Badge>
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>
    default:
      return <Badge variant="outline">{riskLevel}</Badge>
  }
}


const columns: ColumnDef<Borrower>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{(row.getValue("id") as string).slice(0, 8)}...</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const borrower = row.original
      return (
        <div>
          <div className="font-medium">{borrower.name}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "business",
    header: "Business",
    cell: ({ row }) => {
      const borrower = row.original
      return (
        <div>
          <div className="font-medium">{borrower.business}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "credit_score",
    header: "Traditional Score",
    cell: ({ row }) => {
      const borrower = row.original
      return (
        <div className={`font-semibold ${getScoreColor(borrower.credit_score ?? 0)}`}>
          {borrower.credit_score ?? 'N/A'}
        </div>
      )
    },
  },
  {
    accessorKey: "ai_score",
    header: "AI Score",
    cell: ({ row }) => {
      const borrower = row.original
      return (
        <div>
          <div className={`font-semibold ${getScoreColor(borrower.ai_score ?? 0)}`}>
            {borrower.ai_score ?? 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground">AI</div>
        </div>
      )
    },
  },
  {
    accessorKey: "loan_amount",
    header: "Loan Amount",
    cell: ({ row }) => {
      const borrower = row.original
      return (
        <div>
          <div className="font-medium">Rp {(borrower.loan_amount / 1000000).toFixed(1)}M</div>
        </div>
      )
    },
  },
  {
    accessorKey: "risk_level",
    header: "Risk Level",
    cell: ({ row }) => {
      const borrower = row.original
      return getRiskBadge(borrower.risk_level)
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const borrower = row.original
      return (
        <Badge variant={
          borrower.status === "approved" || borrower.status === "active" ? "default" :
          borrower.status === "pending" ? "secondary" :
          "outline"
        }>
          {borrower.status}
        </Badge>
      )
    },
  },
]

export default function DashboardContent() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([])
  const [stats, setStats] = useState({
    totalBorrowers: 0,
    approvedLoans: 0,
    pendingApplications: 0,
    scheduledVisits: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [borrowersData, statsData] = await Promise.all([
          borrowersService.getAll(),
          dashboardService.getStats()
        ])
        setBorrowers(borrowersData)
        setStats(statsData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  
  const table = useReactTable({
    data: borrowers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) {
    return (
      <div className="flex-1 space-y-8 p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </Card>
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* AI-Powered Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Borrowers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBorrowers}</div>
            <p className="text-xs text-muted-foreground">Registered borrowers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Loans</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedLoans}</div>
            <p className="text-xs text-muted-foreground">Active loan portfolio</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Applications pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Visits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduledVisits}</div>
            <p className="text-xs text-muted-foreground">Field agent visits</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Credit Applications</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="multimodal">Multimodal Data</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <Card className="px-6">
            <div>
              <h2 className="text-md font-semibold mb-2">Amara AI Credit Applications</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Applications processed with multimodal AI analysis (tabular + vision + text)
              </p>
            </div>
            <div className="rounded-md border">
              <div className="w-full overflow-auto">
                <table className="w-full">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id} className="border-b bg-muted/30">
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-4 py-3 align-middle text-sm [&:has([role=checkbox])]:pr-0"
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="h-20 text-center text-sm text-muted-foreground">
                          No results.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Gemini Vision Analysis
                </CardTitle>
                <CardDescription>Visual insights from business and house photos</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-primary">Ibu Ratna - Business Scale</h4>
                  <p className="text-sm text-primary/80">Moderate inventory density, home-based setup, consistent customer traffic</p>
                </div>
                <div className="p-3 bg-chart-1/10 rounded-lg border border-chart-1/20">
                  <h4 className="font-medium text-chart-1">Siti - Asset Quality</h4>
                  <p className="text-sm text-chart-1/80">Well-maintained equipment, organized space, business growth indicators</p>
                </div>
                <div className="p-3 bg-chart-3/10 rounded-lg border border-chart-3/20">
                  <h4 className="font-medium text-chart-3">Maria - Risk Factors</h4>
                  <p className="text-sm text-chart-3/80">Limited equipment, seasonal business patterns, higher competition</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Gemini NLP Analysis
                </CardTitle>
                <CardDescription>Text insights from field agent reports</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-3 bg-chart-2/10 rounded-lg border border-chart-2/20">
                  <h4 className="font-medium text-chart-2">Behavioral Consistency</h4>
                  <p className="text-sm text-chart-2/80">All borrowers show consistent business engagement patterns</p>
                </div>
                <div className="p-3 bg-chart-1/10 rounded-lg border border-chart-1/20">
                  <h4 className="font-medium text-chart-1">Income Claims Analysis</h4>
                  <p className="text-sm text-chart-1/80">2 out of 3 applicants have consistent income reports vs visual evidence</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-primary">Risk Indicators</h4>
                  <p className="text-sm text-primary/80">Maria shows income inconsistency requiring manual review</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="multimodal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multimodal Data Sources</CardTitle>
              <CardDescription>Integration of tabular, visual, and text data for comprehensive scoring</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Tabular Data
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Borrower demographics</li>
                    <li>• Repayment history</li>
                    <li>• Loan behavior patterns</li>
                    <li>• Credit baseline score</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Visual Data
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Business photos analysis</li>
                    <li>• House condition assessment</li>
                    <li>• Asset ownership estimation</li>
                    <li>• Economic status indicators</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Text Data
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Field agent notes</li>
                    <li>• Income claim verification</li>
                    <li>• Behavioral sentiment analysis</li>
                    <li>• Risk cue extraction</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table"
import {
  Eye,
  FileText,
  Camera,
  Calculator
} from "lucide-react"
import { borrowersService, dashboardService } from "@/lib/data-service"
import { Database } from "@/lib/supabase"

type Borrower = Database['public']['Tables']['borrowers']['Row']

// Helper functions - defined before columns to avoid reference errors
const getScoreColor = (score: number) => {
  if (score >= 700) return "text-green-600"
  if (score >= 600) return "text-yellow-600"
  return "text-red-600"
}

const getIncomeConsistency = (claimed: number, estimated: number) => {
  const difference = Math.abs(claimed - estimated)
  const percentage = (difference / claimed) * 100
  if (percentage <= 15) return { status: "Consistent", color: "text-green-600" }
  if (percentage <= 30) return { status: "Minor Gap", color: "text-yellow-600" }
  return { status: "Inconsistent", color: "text-red-600" }
}

const columns: ColumnDef<Borrower>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id").slice(0, 8)}...</div>,
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
        <div className={`font-semibold ${getScoreColor(borrower.credit_score)}`}>
          {borrower.credit_score}
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
          <div className={`font-semibold ${getScoreColor(borrower.ai_score)}`}>
            {borrower.ai_score}
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const borrower = row.original
      return (
        <span className={`text-xs ${
          borrower.status === "approved" ? "text-green-600" :
          borrower.status === "pending" ? "text-gray-600" :
          "text-red-600"
        }`}>
          {borrower.status}
        </span>
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
              <div className="h-4 bg-muted rounded w-24 mb-2"></div>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* AI-Powered Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Borrowers</p>
              <p className="text-3xl font-bold mt-2">{stats.totalBorrowers}</p>
              <p className="text-sm text-muted-foreground mt-1">Registered borrowers</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approved Loans</p>
              <p className="text-3xl font-bold mt-2">{stats.approvedLoans}</p>
              <p className="text-sm text-muted-foreground mt-1">Active loan portfolio</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingApplications}</p>
              <p className="text-sm text-muted-foreground mt-1">Applications pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Scheduled Visits</p>
              <p className="text-3xl font-bold mt-2">{stats.scheduledVisits}</p>
              <p className="text-sm text-muted-foreground mt-1">Field agent visits</p>
            </div>
          </div>
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
          <Card className="p-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Amara AI Credit Applications</h2>
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
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Ibu Ratna - Business Scale</h4>
                  <p className="text-sm text-blue-700">Moderate inventory density, home-based setup, consistent customer traffic</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Siti - Asset Quality</h4>
                  <p className="text-sm text-green-700">Well-maintained equipment, organized space, business growth indicators</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Maria - Risk Factors</h4>
                  <p className="text-sm text-yellow-700">Limited equipment, seasonal business patterns, higher competition</p>
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
              <CardContent className="space-y-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Behavioral Consistency</h4>
                  <p className="text-sm text-purple-700">All borrowers show consistent business engagement patterns</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Income Claims Analysis</h4>
                  <p className="text-sm text-green-700">2 out of 3 applicants have consistent income reports vs visual evidence</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Risk Indicators</h4>
                  <p className="text-sm text-blue-700">Maria shows income inconsistency requiring manual review</p>
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
            <CardContent>
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
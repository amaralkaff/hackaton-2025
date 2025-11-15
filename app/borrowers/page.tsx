"use client"

import { useState, useMemo, useEffect } from "react"
import { DashboardLayout } from "@/components/sidebar"
import { Database } from "@/lib/database.types"

type BorrowerRow = Database['public']['Tables']['borrowers']['Row']
type ExtendedBorrower = BorrowerRow & {
  risk_level?: string
  email?: string
  phone?: string
  location?: string
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table"
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  FileText,
  Download,
  Upload,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  Brain,
  Camera
} from "lucide-react"
import { borrowersService } from "@/lib/data-service"
import { exportBorrowersToCSV } from "@/lib/export-utils"
import { supabase } from "@/lib/supabase"

type Borrower = ExtendedBorrower

export default function BorrowersPage() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sorting, setSorting] = useState<SortingState>([])

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [aiReportDialogOpen, setAiReportDialogOpen] = useState(false)
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)

  // Form state for adding borrower
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    location: "",
    loan_amount: "",
    credit_score: "",
  })

  useEffect(() => {
    async function loadBorrowers() {
      try {
        const data = await borrowersService.getAll()
        setBorrowers(data)
      } catch (error) {
        console.error('Error loading borrowers:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBorrowers()
  }, [])

  // Export functionality
  const handleExport = () => {
    exportBorrowersToCSV(borrowers)
  }

  // Add borrower functionality
  const handleAddBorrower = async () => {
    try {
      const { data, error } = await supabase
        .from('borrowers')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business: formData.business,
          location: formData.location,
          loan_amount: parseInt(formData.loan_amount),
          credit_score: parseInt(formData.credit_score) || null,
          status: 'pending',
          risk_level: null,
          ai_score: null,
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setBorrowers([data, ...borrowers])
        setAddDialogOpen(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          business: "",
          location: "",
          loan_amount: "",
          credit_score: "",
        })
      }
    } catch (error) {
      console.error('Error adding borrower:', error)
      alert('Failed to add borrower')
    }
  }

  // View details functionality
  const handleViewDetails = (borrower: Borrower) => {
    setSelectedBorrower(borrower)
    setViewDialogOpen(true)
  }

  // View AI Report functionality
  const handleViewAIReport = (borrower: Borrower) => {
    setSelectedBorrower(borrower)
    setAiReportDialogOpen(true)
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground"
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
        return <Badge variant="default" className="bg-chart-3 text-foreground">Medium</Badge>
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
    header: "Borrower",
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
    header: "Business Details",
    cell: ({ row }) => {
      const borrower = row.original
      return (
        <div>
          <div className="font-medium">{borrower.business}</div>
          <div className="text-xs text-muted-foreground">
            Rp {(borrower.loan_amount / 1000000).toFixed(1)}M requested
          </div>
        </div>
      )
    },
  },
  {
    id: "creditScores",
    header: "Credit Scores",
    cell: ({ row }) => {
      const borrower = row.original
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">Traditional:</span>
            <span className={`font-semibold ${getScoreColor(borrower.credit_score)}`}>
              {borrower.credit_score ?? 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">AI:</span>
            <span className={`font-semibold ${getScoreColor(borrower.ai_score)}`}>
              {borrower.ai_score ?? 'N/A'}
            </span>
            {borrower.ai_score && borrower.credit_score && borrower.ai_score > borrower.credit_score && (
              <span className="text-xs text-chart-1">↑</span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    id: "dataSources",
    header: "Data Sources",
    cell: ({ row }) => {
      const borrower = row.original
      return (
        <div className="flex gap-1">
          {borrower.ai_score && borrower.ai_score > 0 && <Brain className="h-4 w-4 text-chart-1" aria-label="AI Processed" />}
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
        <div className="space-y-1">
          <Badge variant={
            borrower.status === "approved" || borrower.status === "active" ? "default" :
            borrower.status === "pending" ? "secondary" :
            borrower.status === "review" ? "outline" :
            "destructive"
          }>
            {borrower.status}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {borrower.updated_at ? new Date(borrower.updated_at).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const borrower = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewDetails(borrower)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewDetails(borrower)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Application
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewAIReport(borrower)}>
              <FileText className="mr-2 h-4 w-4" />
              View AI Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportBorrowersToCSV([borrower])}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const filteredBorrowers = useMemo(() => {
    return borrowers.filter(borrower => {
      const matchesSearch = borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           borrower.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           borrower.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || borrower.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [borrowers, searchTerm, statusFilter])

  const table = useReactTable({
    data: filteredBorrowers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  const stats = useMemo(() => ({
    total: borrowers.length,
    approved: borrowers.filter(b => b.status === "approved").length,
    pending: borrowers.filter(b => b.status === "pending").length,
    review: borrowers.filter(b => b.status === "review").length,
    aiProcessed: borrowers.filter(b => b.ai_score && b.ai_score > 0).length
  }), [borrowers])

  if (loading) {
    return (
      <DashboardLayout title="Loan Applications">
        <div className="flex-1 space-y-8 p-8">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-20 w-full" />
              </Card>
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Borrower Management">
      <div className="flex-1 space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setAddDialogOpen(true)}>
                    <Users className="h-4 w-4 mr-2" />
                    Quick Add (No AI)
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Quick entry without AI analysis or photo uploads</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Borrowers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Active applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Approved loans</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.review}</div>
              <p className="text-xs text-muted-foreground">Manual review needed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Processed</CardTitle>
              <Brain className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aiProcessed}</div>
              <p className="text-xs text-muted-foreground">With AI insights</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search borrowers by name, ID, or business..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All ({stats.total})
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending ({stats.pending})
                </Button>
                <Button
                  variant={statusFilter === "approved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("approved")}
                >
                  Approved ({stats.approved})
                </Button>
                <Button
                  variant={statusFilter === "review" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("review")}
                >
                  Review ({stats.review})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Borrowers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Borrower Applications</CardTitle>
            <CardDescription>
              {filteredBorrowers.length} borrowers found • Showing applications with AI credit scoring
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>

        {/* Add Borrower Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Borrower</DialogTitle>
              <DialogDescription>
                Enter the borrower&apos;s information to create a new application.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+62 XXX XXXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="business">Business Name</Label>
                <Input
                  id="business"
                  placeholder="Enter business name"
                  value={formData.business}
                  onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, Province"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="loan_amount">Loan Amount (Rp)</Label>
                <Input
                  id="loan_amount"
                  type="number"
                  placeholder="10000000"
                  value={formData.loan_amount}
                  onChange={(e) => setFormData({ ...formData, loan_amount: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="credit_score">Credit Score (Optional)</Label>
                <Input
                  id="credit_score"
                  type="number"
                  placeholder="700"
                  value={formData.credit_score}
                  onChange={(e) => setFormData({ ...formData, credit_score: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBorrower}>Add Borrower</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Borrower Details</DialogTitle>
              <DialogDescription>
                Complete information about the borrower and their application.
              </DialogDescription>
            </DialogHeader>
            {selectedBorrower && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Borrower ID</Label>
                    <div className="font-medium mt-1">{selectedBorrower.id.slice(0, 8)}...</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge variant={
                        selectedBorrower.status === "approved" || selectedBorrower.status === "active" ? "default" :
                        selectedBorrower.status === "pending" ? "secondary" :
                        selectedBorrower.status === "review" ? "outline" :
                        "destructive"
                      }>
                        {selectedBorrower.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    <div className="font-medium mt-1">{selectedBorrower.name}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="font-medium mt-1">{selectedBorrower.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <div className="font-medium mt-1">{selectedBorrower.phone}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <div className="font-medium mt-1">{selectedBorrower.location}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Business</Label>
                  <div className="font-medium mt-1">{selectedBorrower.business}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Loan Amount</Label>
                    <div className="font-medium mt-1">Rp {(selectedBorrower.loan_amount / 1000000).toFixed(1)}M</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Risk Level</Label>
                    <div className="mt-1">{getRiskBadge(selectedBorrower.risk_level)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Traditional Credit Score</Label>
                    <div className={`text-2xl font-bold mt-1 ${getScoreColor(selectedBorrower.credit_score)}`}>
                      {selectedBorrower.credit_score ?? 'N/A'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">AI Credit Score</Label>
                    <div className={`text-2xl font-bold mt-1 ${getScoreColor(selectedBorrower.ai_score)}`}>
                      {selectedBorrower.ai_score ?? 'N/A'}
                      {selectedBorrower.ai_score && selectedBorrower.credit_score && selectedBorrower.ai_score > selectedBorrower.credit_score && (
                        <span className="text-sm text-chart-1 ml-2">↑ Better</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Created</Label>
                    <div className="font-medium mt-1">
                      {selectedBorrower.created_at ? new Date(selectedBorrower.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Updated</Label>
                    <div className="font-medium mt-1">
                      {selectedBorrower.updated_at ? new Date(selectedBorrower.updated_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setViewDialogOpen(false)
                if (selectedBorrower) {
                  handleViewAIReport(selectedBorrower)
                }
              }}>
                View AI Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AI Report Dialog */}
        <Dialog open={aiReportDialogOpen} onOpenChange={setAiReportDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>AI Credit Analysis Report</DialogTitle>
              <DialogDescription>
                Comprehensive AI-powered credit assessment and insights.
              </DialogDescription>
            </DialogHeader>
            {selectedBorrower && (
              <div className="grid gap-6 py-4">
                {/* Borrower Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Borrower Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 font-medium">{selectedBorrower.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Business:</span>
                      <span className="ml-2 font-medium">{selectedBorrower.business}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Loan Amount:</span>
                      <span className="ml-2 font-medium">Rp {(selectedBorrower.loan_amount / 1000000).toFixed(1)}M</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2 font-medium">{selectedBorrower.location}</span>
                    </div>
                  </div>
                </div>

                {/* AI Score Analysis */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">AI Credit Score Analysis</h3>
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Traditional Score</div>
                      <div className={`text-3xl font-bold ${getScoreColor(selectedBorrower.credit_score)}`}>
                        {selectedBorrower.credit_score ?? 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">AI Enhanced Score</div>
                      <div className={`text-3xl font-bold ${getScoreColor(selectedBorrower.ai_score)}`}>
                        {selectedBorrower.ai_score ?? 'N/A'}
                        {selectedBorrower.ai_score && selectedBorrower.credit_score && selectedBorrower.ai_score > selectedBorrower.credit_score && (
                          <span className="text-base text-chart-1 ml-2">↑ {selectedBorrower.ai_score - selectedBorrower.credit_score} points better</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Risk Level:</span>
                      {getRiskBadge(selectedBorrower.risk_level)}
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-chart-2" />
                    AI-Powered Insights
                  </h3>
                  <div className="space-y-3">
                    {selectedBorrower.ai_score && selectedBorrower.ai_score > 0 ? (
                      <>
                        <div className="bg-muted/50 p-3 rounded">
                          <div className="font-medium text-sm mb-1">Alternative Data Analysis</div>
                          <div className="text-sm text-muted-foreground">
                            Our AI model has analyzed social media presence, transaction patterns, and business
                            activity to provide a more comprehensive credit assessment.
                          </div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                          <div className="font-medium text-sm mb-1">Risk Factors</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedBorrower.risk_level === 'low' && "Borrower shows strong repayment indicators and stable business activity."}
                            {selectedBorrower.risk_level === 'medium' && "Moderate risk profile with room for improvement in payment consistency."}
                            {selectedBorrower.risk_level === 'high' && "Higher risk indicators detected, recommend additional verification."}
                            {!selectedBorrower.risk_level && "Risk analysis pending additional data collection."}
                          </div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                          <div className="font-medium text-sm mb-1">Recommendation</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedBorrower.ai_score >= 700 && "Strong candidate for loan approval. Recommend standard terms."}
                            {selectedBorrower.ai_score >= 600 && selectedBorrower.ai_score < 700 && "Moderate candidate. Consider adjusted terms or additional collateral."}
                            {selectedBorrower.ai_score < 600 && "Recommend further review and verification before approval."}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-muted/50 p-3 rounded text-center">
                        <div className="text-sm text-muted-foreground">
                          AI analysis not yet completed for this borrower. Please initiate scoring process.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Data Sources */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Data Sources Analyzed</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-chart-1" />
                      <span>Traditional Credit Bureau</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {selectedBorrower.ai_score ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-chart-1" />
                          <span>Social Media Analysis</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Social Media Analysis</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {selectedBorrower.ai_score ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-chart-1" />
                          <span>Transaction History</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Transaction History</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {selectedBorrower.ai_score ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-chart-1" />
                          <span>Business Activity Patterns</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Business Activity Patterns</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setAiReportDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                if (selectedBorrower) {
                  exportBorrowersToCSV([selectedBorrower])
                }
              }}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
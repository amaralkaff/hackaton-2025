"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

interface Borrower {
  id: string
  name: string
  age: number
  business: string
  location: string
  creditScore: number
  aiScore: number
  riskLevel: "low" | "medium" | "high"
  status: "pending" | "approved" | "rejected" | "review"
  lastUpdated: string
  loanAmount: number
  hasPhotos: boolean
  hasFieldNotes: boolean
}

const mockBorrowers: Borrower[] = [
  {
    id: "B001",
    name: "Ibu Ratna",
    age: 38,
    business: "Home-based snack business",
    location: "Desa Sukamaju, West Java",
    creditScore: 650,
    aiScore: 720,
    riskLevel: "low",
    status: "approved",
    lastUpdated: "2024-01-15",
    loanAmount: 8000000,
    hasPhotos: true,
    hasFieldNotes: true
  },
  {
    id: "B002",
    name: "Siti Nurhaliza",
    age: 32,
    business: "Warung (small shop)",
    location: "Desa Harapan, East Java",
    creditScore: 680,
    aiScore: 750,
    riskLevel: "low",
    status: "approved",
    lastUpdated: "2024-01-14",
    loanAmount: 10000000,
    hasPhotos: true,
    hasFieldNotes: true
  },
  {
    id: "B003",
    name: "Maria Rodriguez",
    age: 28,
    business: "Tailoring service",
    location: "Desa Makmur, Central Java",
    creditScore: 620,
    aiScore: 580,
    riskLevel: "medium",
    status: "review",
    lastUpdated: "2024-01-13",
    loanAmount: 15000000,
    hasPhotos: true,
    hasFieldNotes: false
  },
  {
    id: "B004",
    name: "Fatima Ahmed",
    age: 45,
    business: "Food stall",
    location: "Desa sejahtera, Central Java",
    creditScore: 450,
    aiScore: 420,
    riskLevel: "high",
    status: "pending",
    lastUpdated: "2024-01-12",
    loanAmount: 8000000,
    hasPhotos: false,
    hasFieldNotes: true
  },
  {
    id: "B005",
    name: "Dewi Lestari",
    age: 35,
    business: "Vegetable stall",
    location: "Desa Bersih, West Java",
    creditScore: 580,
    aiScore: 620,
    riskLevel: "medium",
    status: "pending",
    lastUpdated: "2024-01-11",
    loanAmount: 5000000,
    hasPhotos: true,
    hasFieldNotes: true
  }
]

export default function BorrowersPage() {
  const [borrowers] = useState<Borrower[]>(mockBorrowers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<Borrower>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "Borrower",
    cell: ({ row }) => {
      const borrower = row.original
      return (
        <div>
          <div className="font-medium">{borrower.name}</div>
          <div className="text-xs text-muted-foreground">{borrower.age} years old</div>
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
          <div className="text-xs text-muted-foreground">{borrower.location}</div>
          <div className="text-xs text-muted-foreground">
            Rp {(borrower.loanAmount / 1000000).toFixed(1)}M requested
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
            <span className={`font-semibold ${getScoreColor(borrower.creditScore)}`}>
              {borrower.creditScore}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">AI:</span>
            <span className={`font-semibold ${getScoreColor(borrower.aiScore)}`}>
              {borrower.aiScore}
            </span>
            {borrower.aiScore > borrower.creditScore && (
              <span className="text-xs text-green-600">↑</span>
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
          {borrower.hasPhotos && <Camera className="h-4 w-4 text-blue-500" title="Photos Available" />}
          {borrower.hasFieldNotes && <FileText className="h-4 w-4 text-purple-500" title="Field Notes" />}
          {borrower.aiScore > 0 && <Brain className="h-4 w-4 text-green-500" title="AI Processed" />}
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
        <div className="space-y-1">
          <span className={`text-xs ${
            borrower.status === "approved" ? "text-green-600" :
            borrower.status === "pending" ? "text-gray-600" :
            borrower.status === "review" ? "text-blue-600" :
            "text-red-600"
          }`}>
            {borrower.status}
          </span>
          <div className="text-xs text-muted-foreground">
            {borrower.lastUpdated}
          </div>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit Application
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            View AI Report
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
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

  
  const getScoreColor = (score: number) => {
    if (score >= 700) return "text-green-600"
    if (score >= 600) return "text-yellow-600"
    return "text-red-600"
  }

  const stats = useMemo(() => ({
    total: borrowers.length,
    approved: borrowers.filter(b => b.status === "approved").length,
    pending: borrowers.filter(b => b.status === "pending").length,
    review: borrowers.filter(b => b.status === "review").length,
    aiProcessed: borrowers.filter(b => b.aiScore > 0).length
  }), [borrowers])

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Borrower Management</h1>
            <p className="text-muted-foreground">Manage and track credit applications with AI insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Add Borrower
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Borrowers</p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
                <p className="text-sm text-muted-foreground mt-1">Active applications</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold mt-2">{stats.approved}</p>
                <p className="text-sm text-muted-foreground mt-1">Approved loans</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                <p className="text-sm text-muted-foreground mt-1">Awaiting review</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                <p className="text-3xl font-bold mt-2">{stats.review}</p>
                <p className="text-sm text-muted-foreground mt-1">Manual review needed</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Processed</p>
                <p className="text-3xl font-bold mt-2">{stats.aiProcessed}</p>
                <p className="text-sm text-muted-foreground mt-1">With AI insights</p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6">
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
        </Card>

        {/* Borrowers Table */}
        <Card className="p-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Borrower Applications</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {filteredBorrowers.length} borrowers found • Showing applications with AI-enhanced credit scoring
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
      </div>
    </DashboardLayout>
  )
}
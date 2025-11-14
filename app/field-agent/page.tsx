"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  Camera,
  FileText,
  Plus,
  Search,
  Filter,
  Navigation,
  Phone,
  Star,
  Brain,
  Zap
} from "lucide-react"

interface FieldVisit {
  id: string
  borrowerName: string
  businessType: string
  location: string
  scheduledDate: string
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  agent: string
  priority: "high" | "medium" | "low"
  hasReport: boolean
  aiProcessed: boolean
}

interface Borrower {
  id: string
  name: string
  business: string
  location: string
  lastVisit: string
  nextVisit?: string
  riskLevel: "low" | "medium" | "high"
  needsVisit: boolean
}

const mockVisits: FieldVisit[] = [
  {
    id: "V001",
    borrowerName: "Ibu Ratna",
    businessType: "Home-based snack business",
    location: "Desa Sukamaju, West Java",
    scheduledDate: "2024-01-16",
    status: "scheduled",
    agent: "Agent Ahmad",
    priority: "medium",
    hasReport: false,
    aiProcessed: false
  },
  {
    id: "V002",
    borrowerName: "Maria Rodriguez",
    businessType: "Tailoring service",
    location: "Desa Makmur, Central Java",
    scheduledDate: "2024-01-15",
    status: "in-progress",
    agent: "Agent Siti",
    priority: "high",
    hasReport: true,
    aiProcessed: false
  },
  {
    id: "V003",
    borrowerName: "Siti Nurhaliza",
    businessType: "Warung (small shop)",
    location: "Desa Harapan, East Java",
    scheduledDate: "2024-01-14",
    status: "completed",
    agent: "Agent Budi",
    priority: "low",
    hasReport: true,
    aiProcessed: true
  }
]

const mockBorrowers: Borrower[] = [
  {
    id: "B001",
    name: "Ibu Ratna",
    business: "Home-based snack business",
    location: "Desa Sukamaju, West Java",
    lastVisit: "2024-01-10",
    nextVisit: "2024-01-16",
    riskLevel: "low",
    needsVisit: true
  },
  {
    id: "B002",
    name: "Maria Rodriguez",
    business: "Tailoring service",
    location: "Desa Makmur, Central Java",
    lastVisit: "2024-01-08",
    nextVisit: "2024-01-15",
    riskLevel: "medium",
    needsVisit: true
  },
  {
    id: "B003",
    name: "Dewi Lestari",
    business: "Vegetable stall",
    location: "Desa Bersih, West Java",
    lastVisit: "2024-01-12",
    riskLevel: "medium",
    needsVisit: false
  }
]

export default function FieldAgentPage() {
  const [visits] = useState<FieldVisit[]>(mockVisits)
  const [borrowers] = useState<Borrower[]>(mockBorrowers)

  
  const stats = {
    totalVisits: visits.length,
    completed: visits.filter(v => v.status === "completed").length,
    scheduled: visits.filter(v => v.status === "scheduled").length,
    inProgress: visits.filter(v => v.status === "in-progress").length,
    aiProcessed: visits.filter(v => v.aiProcessed).length
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Field Agent Portal</h1>
            <p className="text-muted-foreground">Manage field visits and collect multimodal data for AI analysis</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Visit
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVisits}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Field reports submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduled}</div>
              <p className="text-xs text-muted-foreground">Upcoming visits</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Active visits</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Processed</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aiProcessed}</div>
              <p className="text-xs text-muted-foreground">With AI insights</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="visits" className="space-y-6">
          <TabsList>
            <TabsTrigger value="visits">Field Visits</TabsTrigger>
            <TabsTrigger value="borrowers">Borrower Directory</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="visits" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search visits by borrower name, location, or agent..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      Today
                    </Button>
                    <Button variant="outline" size="sm">
                      This Week
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visits List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visits.map((visit) => (
                <Card key={visit.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        visit.priority === "high" ? "text-red-600" :
                        visit.priority === "medium" ? "text-yellow-600" :
                        "text-gray-600"
                      }`}>
                        {visit.priority}
                      </span>
                      <span className={`text-xs ${
                        visit.status === "completed" ? "text-green-600" :
                        visit.status === "in-progress" ? "text-blue-600" :
                        visit.status === "scheduled" ? "text-gray-600" :
                        "text-red-600"
                      }`}>
                        {visit.status}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{visit.borrowerName}</CardTitle>
                    <CardDescription>{visit.businessType}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {visit.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {visit.scheduledDate}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Agent: {visit.agent}
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      {visit.hasReport && (
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Report
                        </span>
                      )}
                      {visit.aiProcessed && (
                        <span className="text-xs px-2 py-1 bg-green-200 text-green-700 rounded flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          AI
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      {visit.status === "scheduled" && (
                        <Button size="sm" className="flex-1">
                          Start Visit
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="borrowers" className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search borrowers by name or business type..."
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Borrowers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {borrowers.map((borrower) => (
                <Card key={borrower.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        borrower.riskLevel === "low" ? "text-green-600" :
                        borrower.riskLevel === "medium" ? "text-yellow-600" :
                        "text-red-600"
                      }`}>
                        {borrower.riskLevel} risk
                      </span>
                      {borrower.needsVisit && (
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Visit Needed
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{borrower.name}</CardTitle>
                    <CardDescription>{borrower.business}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {borrower.location}
                    </div>
                    <div className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Last Visit:</span>
                        <span>{borrower.lastVisit}</span>
                      </div>
                      {borrower.nextVisit && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Next Visit:</span>
                          <span>{borrower.nextVisit}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Navigation className="h-3 w-3 mr-1" />
                        Navigate
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Schedule Visit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mobile App Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Mobile Field Tools
                  </CardTitle>
                  <CardDescription>Essential tools for field agents on mobile devices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">📱 Photo Capture</h4>
                    <p className="text-sm text-muted-foreground">Upload business and house photos directly from mobile</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">📝 Voice Notes</h4>
                    <p className="text-sm text-muted-foreground">Record field observations with voice-to-text</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🗺️ GPS Tracking</h4>
                    <p className="text-sm text-muted-foreground">Automatic location tagging for visit verification</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🔄 Offline Mode</h4>
                    <p className="text-sm text-muted-foreground">Work offline and sync when connection available</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Frequently used tools and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    New Field Visit
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Camera className="h-4 w-4 mr-2" />
                    Quick Photo Upload
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Field Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate to Next Visit
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Find Nearby Borrowers
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Performance Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Field Agent Tips
                </CardTitle>
                <CardDescription>Best practices for collecting quality multimodal data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">📸 Photo Guidelines</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Take clear, well-lit photos</li>
                      <li>• Show business equipment and inventory</li>
                      <li>• Include customer activity if possible</li>
                      <li>• Capture multiple angles</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">📝 Report Quality</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Be specific about business operations</li>
                      <li>• Note income patterns and seasonality</li>
                      <li>• Document customer relationships</li>
                      <li>• Mention growth potential</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
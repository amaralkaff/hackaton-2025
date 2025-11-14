"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/sidebar"
import { Database } from "@/lib/database.types"

type VisitRow = Database['public']['Tables']['visits']['Row']
type ExtendedVisit = VisitRow & {
  purpose?: string
  photo_urls?: string[]
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
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
import { visitsService, borrowersService } from "@/lib/data-service"
import { supabase } from "@/lib/supabase"

type Visit = ExtendedVisit & {
  borrower: { name: string; business: string; status: string }
  agent: { name: string }
}
type BorrowerRow = Database['public']['Tables']['borrowers']['Row']
type Borrower = BorrowerRow

export default function FieldAgentPage() {
  const [visits, setVisits] = useState<Visit[]>([])
  const [borrowers, setBorrowers] = useState<Borrower[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog states
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null)

  // Form state
  const [scheduleForm, setScheduleForm] = useState({
    borrowerId: "",
    scheduledDate: undefined as Date | undefined,
    purpose: "",
    notes: ""
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [visitsData, borrowersData] = await Promise.all([
          visitsService.getAll(),
          borrowersService.getAll()
        ])
        setVisits(visitsData as Visit[])
        setBorrowers(borrowersData)
      } catch (error) {
        console.error('Error loading field agent data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Handle schedule visit
  const handleScheduleVisit = async (borrower?: Borrower) => {
    if (borrower) {
      setScheduleForm({
        borrowerId: borrower.id,
        scheduledDate: undefined,
        purpose: "",
        notes: ""
      })
    }
    setScheduleDialogOpen(true)
  }

  const handleSubmitSchedule = async () => {
    try {
      if (!scheduleForm.scheduledDate) {
        alert('Please select a visit date')
        return
      }

      const { data, error } = await supabase
        .from('visits')
        .insert({
          borrower_id: scheduleForm.borrowerId || borrowers[0]?.id,
          agent_id: '00000000-0000-0000-0000-000000000001', // Mock agent ID
          scheduled_date: scheduleForm.scheduledDate.toISOString(),
          status: 'scheduled',
          purpose: scheduleForm.purpose,
          notes: scheduleForm.notes
        })
        .select()
        .single()

      if (error) throw error

      // Refresh visits
      const visitsData = await visitsService.getAll()
      setVisits(visitsData as Visit[])
      setScheduleDialogOpen(false)
      setScheduleForm({ borrowerId: "", scheduledDate: undefined, purpose: "", notes: "" })
    } catch (error) {
      console.error('Error scheduling visit:', error)
      alert('Failed to schedule visit')
    }
  }

  // Handle start visit
  const handleStartVisit = async (visit: Visit) => {
    try {
      const { error } = await supabase
        .from('visits')
        .update({ status: 'in-progress' })
        .eq('id', visit.id)

      if (error) throw error

      // Update local state
      setVisits(visits.map(v => v.id === visit.id ? { ...v, status: 'in-progress' } : v))
    } catch (error) {
      console.error('Error starting visit:', error)
      alert('Failed to start visit')
    }
  }

  // Handle view details
  const handleViewDetails = (visit: Visit) => {
    setSelectedVisit(visit)
    setViewDialogOpen(true)
  }

  
  const stats = {
    totalVisits: visits.length,
    completed: visits.filter(v => v.status === "completed").length,
    scheduled: visits.filter(v => v.status === "scheduled").length,
    inProgress: visits.filter(v => v.status === "in-progress").length,
    aiProcessed: visits.filter(v => v.notes && v.notes.length > 0).length
  }

  if (loading) {
    return (
      <DashboardLayout title="Field Agent Portal">
        <div className="flex-1 space-y-8 p-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-96" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          {/* Stats Overview Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar Skeleton */}
              <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>

              {/* Visit Cards Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 flex-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Field Agent Portal">
      <div className="flex-1 space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button onClick={() => handleScheduleVisit()}>
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
              <CardContent>
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
              {visits.length === 0 ? (
                <div className="col-span-3 text-center text-muted-foreground py-8">
                  No visits found
                </div>
              ) : (
                visits.map((visit) => (
                  <Card key={visit.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${
                          visit.status === "completed" ? "text-chart-1" :
                          visit.status === "in-progress" ? "text-primary" :
                          visit.status === "scheduled" ? "text-muted-foreground" :
                          "text-destructive"
                        }`}>
                          {visit.status}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{visit.borrower.name}</CardTitle>
                      <CardDescription>{visit.borrower.business}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(visit.scheduled_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Agent: {visit.agent.name}
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        {visit.notes && (
                          <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Notes
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewDetails(visit)}>
                          View Details
                        </Button>
                        {visit.status === "scheduled" && (
                          <Button size="sm" className="flex-1" onClick={() => handleStartVisit(visit)}>
                            Start Visit
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="borrowers" className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent>
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
              {borrowers.map((borrower) => {
                const riskLevel = borrower.credit_score && borrower.credit_score >= 700 ? "low" :
                                 borrower.credit_score && borrower.credit_score >= 600 ? "medium" : "high"
                const needsVisit = borrower.status === "pending" || borrower.status === "review"

                return (
                  <Card key={borrower.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <Badge
                          className={`${
                            riskLevel === "low"
                              ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                              : riskLevel === "medium"
                              ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                              : ""
                          }`}
                          variant={riskLevel === "high" ? "destructive" : "outline"}
                        >
                          {riskLevel} risk
                        </Badge>
                        {needsVisit && (
                          <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20" variant="outline">
                            <AlertTriangle className="h-3 w-3" />
                            Visit Needed
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{borrower.name}</CardTitle>
                      <CardDescription>{borrower.business}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                      <div className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className={`font-medium ${
                            borrower.status === "approved" ? "text-chart-1" :
                            borrower.status === "pending" ? "text-chart-3" :
                            "text-muted-foreground"
                          }`}>{borrower.status}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Credit Score:</span>
                          <span>{borrower.credit_score ?? 'N/A'}</span>
                        </div>
                        {borrower.ai_score && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">AI Score:</span>
                            <span>{borrower.ai_score}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm" variant="outline">
                            <Navigation className="h-3 w-3 mr-1" />
                            Navigate
                          </Button>
                        </div>
                        <Button size="sm" className="w-full" onClick={() => handleScheduleVisit(borrower)}>
                          <Calendar className="h-3 w-3 mr-2" />
                          Schedule Visit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
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
                <CardContent className="pt-6 space-y-4">
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
                <CardContent className="pt-6 space-y-4">
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
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-primary mb-2">📸 Photo Guidelines</h4>
                    <ul className="text-sm text-primary/80 space-y-1">
                      <li>• Take clear, well-lit photos</li>
                      <li>• Show business equipment and inventory</li>
                      <li>• Include customer activity if possible</li>
                      <li>• Capture multiple angles</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-chart-1/10 rounded-lg border border-chart-1/20">
                    <h4 className="font-medium text-chart-1 mb-2">📝 Report Quality</h4>
                    <ul className="text-sm text-chart-1/80 space-y-1">
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

        {/* Schedule Visit Dialog */}
        <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule Field Visit</DialogTitle>
              <DialogDescription>
                Schedule a new field visit to assess borrower&apos;s business and home.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="borrower">Borrower</Label>
                <Select
                  value={scheduleForm.borrowerId}
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, borrowerId: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a borrower" />
                  </SelectTrigger>
                  <SelectContent>
                    {borrowers.map(b => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name} - {b.business}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scheduledDate">Visit Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {scheduleForm.scheduledDate ? (
                        scheduleForm.scheduledDate.toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })
                      ) : (
                        <span className="text-muted-foreground">Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={scheduleForm.scheduledDate}
                      onSelect={(date) => setScheduleForm({ ...scheduleForm, scheduledDate: date })}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  placeholder="Initial assessment, follow-up, etc."
                  value={scheduleForm.purpose}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, purpose: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about the visit..."
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitSchedule}>Schedule Visit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Visit Details Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Visit Details</DialogTitle>
              <DialogDescription>
                Complete information about this field visit.
              </DialogDescription>
            </DialogHeader>
            {selectedVisit && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Visit ID</Label>
                    <div className="font-medium mt-1">{selectedVisit.id.slice(0, 8)}...</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        selectedVisit.status === "completed" ? "bg-chart-1/10 text-chart-1" :
                        selectedVisit.status === "in-progress" ? "bg-chart-2/10 text-chart-2" :
                        selectedVisit.status === "scheduled" ? "bg-muted text-muted-foreground" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {selectedVisit.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Borrower</Label>
                  <div className="font-medium mt-1">{selectedVisit.borrower.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedVisit.borrower.business}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Scheduled Date</Label>
                    <div className="font-medium mt-1">
                      {new Date(selectedVisit.scheduled_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Field Agent</Label>
                    <div className="font-medium mt-1">{selectedVisit.agent.name}</div>
                  </div>
                </div>
                {selectedVisit.purpose && (
                  <div>
                    <Label className="text-muted-foreground">Purpose</Label>
                    <div className="font-medium mt-1">{selectedVisit.purpose}</div>
                  </div>
                )}
                {selectedVisit.notes && (
                  <div>
                    <Label className="text-muted-foreground">Notes</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                      {selectedVisit.notes}
                    </div>
                  </div>
                )}
                {selectedVisit.photo_urls && selectedVisit.photo_urls.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Photos</Label>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {selectedVisit.photo_urls.length} photo(s) attached
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Created</Label>
                    <div className="font-medium mt-1">
                      {selectedVisit.created_at ? new Date(selectedVisit.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Updated</Label>
                    <div className="font-medium mt-1">
                      {selectedVisit.updated_at ? new Date(selectedVisit.updated_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
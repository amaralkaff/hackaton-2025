"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Eye,
  FileText,
  Target,
  BarChart3,
  Activity,
  Sparkles,
  Brain,
  Zap,
  CheckCircle,
  Camera,
  Download
} from "lucide-react"
import { insightsService } from "@/lib/data-service"
import { generateTextReport, downloadTextFile } from "@/lib/export-utils"

interface AIInsight {
  type: string
  title: string
  description: string
  impact: "positive" | "negative" | "neutral"
  count: number
}

interface PerformanceMetrics {
  approvalRate: number
  aiCoverage: number
  totalBorrowers: number
  avgAIScore: number
}

interface VisitStats {
  totalVisits: number
  completed: number
  scheduled: number
  withNotes: number
  completionRate: number
}

export default function InsightsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    approvalRate: 0,
    aiCoverage: 0,
    totalBorrowers: 0,
    avgAIScore: 0
  })
  const [visitStats, setVisitStats] = useState<VisitStats>({
    totalVisits: 0,
    completed: 0,
    scheduled: 0,
    withNotes: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInsights() {
      try {
        const [insightsData, visitsData] = await Promise.all([
          insightsService.getAIInsights(),
          insightsService.getVisitStats()
        ])
        setAiInsights(insightsData.aiInsights)
        setPerformanceMetrics(insightsData.performanceMetrics)
        setVisitStats(visitsData)
      } catch (error) {
        console.error('Error loading insights:', error)
      } finally {
        setLoading(false)
      }
    }
    loadInsights()
  }, [])

  // Handle download report
  const handleDownloadReport = () => {
    const sections = [
      {
        title: "Performance Overview",
        content: `AI Coverage: ${performanceMetrics.aiCoverage}%
Approval Rate: ${performanceMetrics.approvalRate}%
Total Borrowers: ${performanceMetrics.totalBorrowers}
Average AI Score: ${performanceMetrics.avgAIScore}
Time Range: ${selectedTimeRange}`
      },
      {
        title: "Field Visit Statistics",
        content: `Total Visits: ${visitStats.totalVisits}
Completed Visits: ${visitStats.completed}
Scheduled Visits: ${visitStats.scheduled}
Visits with Notes: ${visitStats.withNotes}
Completion Rate: ${visitStats.completionRate}%`
      },
      {
        title: "AI-Generated Insights",
        content: aiInsights.map((insight, i) =>
          `${i + 1}. ${insight.title} (${insight.type})
   ${insight.description}
   Impact: ${insight.impact} | Count: ${insight.count}`
        ).join('\n\n')
      }
    ]

    const report = generateTextReport("Amara AI - Insights & Analytics Report", sections)
    const filename = `amara_insights_report_${new Date().toISOString().split('T')[0]}.txt`
    downloadTextFile(report, filename)
  }

  if (loading) {
    return (
      <DashboardLayout title="AI Insights & Analytics">
        <div className="flex-1 space-y-8 p-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-96" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Metrics Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="p-3 rounded-lg border">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
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

  const performanceCards = [
    {
      title: "AI Coverage",
      value: `${performanceMetrics.aiCoverage}%`,
      change: `${performanceMetrics.aiCoverage > 50 ? '+' : ''}${Math.round(performanceMetrics.aiCoverage - 50)}%`,
      trend: "up",
      icon: Brain
    },
    {
      title: "Avg AI Score",
      value: Math.round(performanceMetrics.avgAIScore).toString(),
      change: "+3.1%",
      trend: "up",
      icon: Zap
    },
    {
      title: "Visit Completion",
      value: `${visitStats.completionRate}%`,
      change: "+5%",
      trend: "up",
      icon: Target
    },
    {
      title: "Approval Rate",
      value: `${performanceMetrics.approvalRate}%`,
      change: `+${Math.max(0, performanceMetrics.approvalRate - 50)}%`,
      trend: "up",
      icon: CheckCircle
    }
  ]

  const geminiDataSources = [
    {
      name: "Field Visits",
      total: visitStats.totalVisits,
      processed: visitStats.completed,
      insights: "Visit status, field observations, borrower interactions",
      icon: Camera
    },
    {
      name: "Borrower Profiles",
      total: performanceMetrics.totalBorrowers,
      processed: Math.round(performanceMetrics.totalBorrowers * (performanceMetrics.aiCoverage / 100)),
      insights: "Credit scores, business data, loan applications",
      icon: Eye
    },
    {
      name: "Field Agent Notes",
      total: visitStats.totalVisits,
      processed: visitStats.withNotes,
      insights: "Income claims, behavioral patterns, risk indicators",
      icon: FileText
    }
  ]

  return (
    <DashboardLayout title="AI Insights & Analytics">
      <div className="flex-1 space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedTimeRange}
              onValueChange={(value) => setSelectedTimeRange(value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {performanceCards.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-chart-1">{metric.change}</span> from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="gemini">Data Sources</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Key AI Insights
                  </CardTitle>
                  <CardDescription>Critical insights from multimodal AI analysis</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{insight.title}</h3>
                        <span className={`text-xs ${
                          insight.impact === "positive" ? "text-chart-1" :
                          insight.impact === "negative" ? "text-destructive" : "text-muted-foreground"
                        }`}>
                          {insight.impact === "positive" ? "Positive" :
                           insight.impact === "negative" ? "Alert" : "Neutral"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Affected borrowers</span>
                        <span className="text-sm font-semibold">{insight.count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Statistics Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    System Statistics
                  </CardTitle>
                  <CardDescription>Overview of borrower data and AI processing</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{performanceMetrics.totalBorrowers}</div>
                      <div className="text-sm text-muted-foreground">Total Borrowers</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{performanceMetrics.aiCoverage}%</div>
                      <div className="text-sm text-muted-foreground">AI Coverage</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{visitStats.totalVisits}</div>
                      <div className="text-sm text-muted-foreground">Field Visits</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{visitStats.completionRate}%</div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gemini" className="space-y-6">
            {/* Data Sources Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Multimodal Data Processing</CardTitle>
                <CardDescription>Overview of data sources processed by Amara AI</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {geminiDataSources.map((source, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <source.icon className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">{source.name}</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total</span>
                          <span className="text-sm font-semibold">{source.total}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Processed</span>
                          <span className="text-sm font-semibold">{source.processed}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: source.total > 0 ? `${(source.processed / source.total) * 100}%` : '0%' }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{source.insights}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Model Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    AI System Performance
                  </CardTitle>
                  <CardDescription>Real-time performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{performanceMetrics.totalBorrowers}</div>
                      <div className="text-sm text-muted-foreground">Records Processed</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{performanceMetrics.aiCoverage}%</div>
                      <div className="text-sm text-muted-foreground">AI Coverage</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{Math.round(performanceMetrics.avgAIScore)}</div>
                      <div className="text-sm text-muted-foreground">Avg AI Score</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{performanceMetrics.approvalRate}%</div>
                      <div className="text-sm text-muted-foreground">Approval Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Business Impact
                  </CardTitle>
                  <CardDescription>How Amara AI is transforming credit assessment</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="p-4 bg-chart-1/10 rounded-lg border border-chart-1/20">
                    <h4 className="font-medium text-chart-1 mb-2">Data-Driven Assessment</h4>
                    <p className="text-sm text-chart-1/80">
                      {performanceMetrics.aiCoverage}% of applications processed with AI credit scoring
                    </p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-primary mb-2">Field Operations</h4>
                    <p className="text-sm text-primary/80">
                      {visitStats.completionRate}% visit completion rate with systematic data collection
                    </p>
                  </div>
                  <div className="p-4 bg-chart-2/10 rounded-lg border border-chart-2/20">
                    <h4 className="font-medium text-chart-2 mb-2">Financial Inclusion</h4>
                    <p className="text-sm text-chart-2/80">
                      {performanceMetrics.totalBorrowers} borrowers served with fair and accurate assessments
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

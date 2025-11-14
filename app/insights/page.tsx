"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Camera
} from "lucide-react"

export default function InsightsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")

  const aiInsights = [
    {
      type: "vision",
      title: "Business Scale Analysis",
      description: "AI detected 67% of borrowers have moderate-to-high business scale with consistent customer traffic",
      impact: "positive",
      count: 104
    },
    {
      type: "nlp",
      title: "Income Consistency Check",
      description: "Field notes show 76% income consistency with visual evidence for approved loans",
      impact: "positive",
      count: 89
    },
    {
      type: "risk",
      title: "High Risk Indicators",
      description: "15 applicants show significant income discrepancies requiring manual review",
      impact: "negative",
      count: 15
    },
    {
      type: "trend",
      title: "Equipment Quality Analysis",
      description: "Visual assessment indicates 82% have adequate business equipment for requested loans",
      impact: "positive",
      count: 128
    }
  ]

  const performanceMetrics = [
    {
      title: "AI Model Accuracy",
      value: "94.2%",
      change: "+3.1%",
      trend: "up",
      icon: Brain
    },
    {
      title: "Processing Time",
      value: "2.3 min",
      change: "-45%",
      trend: "up",
      icon: Zap
    },
    {
      title: "Default Rate Reduction",
      value: "23%",
      change: "+23%",
      trend: "up",
      icon: Target
    },
    {
      title: "Loan Approval Rate",
      value: "68%",
      change: "+12%",
      trend: "up",
      icon: CheckCircle
    }
  ]

  const geminiDataSources = [
    {
      name: "Business Photos",
      total: 145,
      processed: 132,
      insights: "Asset quality, inventory levels, business scale",
      icon: Camera
    },
    {
      name: "House Photos",
      total: 120,
      processed: 108,
      insights: "Living conditions, economic stability, family support",
      icon: Eye
    },
    {
      name: "Field Agent Notes",
      total: 156,
      processed: 156,
      insights: "Income claims, behavioral patterns, risk indicators",
      icon: FileText
    }
  ]

  const riskDistribution = [
    { level: "Low Risk", count: 89, percentage: 57, color: "bg-green-500" },
    { level: "Medium Risk", count: 52, percentage: 33, color: "bg-yellow-500" },
    { level: "High Risk", count: 15, percentage: 10, color: "bg-red-500" }
  ]

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Insights & Analytics</h1>
            <p className="text-muted-foreground">Multimodal AI analysis and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button variant="outline">
              Download Report
            </Button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{metric.change}</span> from last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="gemini">Gemini Analysis</TabsTrigger>
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
                <CardContent className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{insight.title}</h3>
                        <span className={`text-xs ${
                          insight.impact === "positive" ? "text-green-600" : "text-red-600"
                        }`}>
                          {insight.impact === "positive" ? "Positive" : "Alert"}
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

              {/* Risk Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Risk Distribution
                  </CardTitle>
                  <CardDescription>AI-enhanced risk assessment results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {riskDistribution.map((risk, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{risk.level}</span>
                        <span className="text-sm font-semibold">{risk.count} borrowers</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${risk.color} h-2 rounded-full`}
                          style={{ width: `${risk.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{risk.percentage}% of total</span>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">AI Model Confidence</span>
                      <span className="text-sm font-semibold">94.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "94.2%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gemini" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gemini Vision Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Gemini Vision Analysis
                  </CardTitle>
                  <CardDescription>Visual insights from business and house photos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Business Asset Quality</h4>
                    <p className="text-sm text-blue-700">82% of applicants show adequate equipment and inventory for requested loan amounts</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Income Indicators</h4>
                    <p className="text-sm text-green-700">Visual cues correlate with income claims in 76% of approved applications</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Growth Potential</h4>
                    <p className="text-sm text-yellow-700">45% show clear business expansion opportunities based on current setup</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">132</div>
                      <div className="text-sm text-muted-foreground">Photos Analyzed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">91%</div>
                      <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gemini NLP Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Gemini NLP Analysis
                  </CardTitle>
                  <CardDescription>Text insights from field agent reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Behavioral Consistency</h4>
                    <p className="text-sm text-purple-700">Field notes reveal consistent business engagement patterns in 89% of borrowers</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Risk Cue Detection</h4>
                    <p className="text-sm text-green-700">Successfully identified 15 high-risk applications through sentiment analysis</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Income Validation</h4>
                    <p className="text-sm text-blue-700">Text analysis cross-references income claims with business descriptions</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">156</div>
                      <div className="text-sm text-muted-foreground">Notes Processed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">88%</div>
                      <div className="text-sm text-muted-foreground">Validation Success</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Sources Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Multimodal Data Processing</CardTitle>
                <CardDescription>Overview of data sources processed by Gemini AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {geminiDataSources.map((source, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <source.icon className="h-5 w-5 text-blue-500" />
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
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(source.processed / source.total) * 100}%` }}
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
                    AI Model Performance
                  </CardTitle>
                  <CardDescription>Real-time performance metrics for Gemini integration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">2.3 min</div>
                      <div className="text-sm text-muted-foreground">Avg Processing Time</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">94.2%</div>
                      <div className="text-sm text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">23%</div>
                      <div className="text-sm text-muted-foreground">Risk Reduction</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">99.8%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Model Performance Trend</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Vision Analysis</span>
                        <span className="text-green-600">96.2% accuracy</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>NLP Processing</span>
                        <span className="text-green-600">94.8% accuracy</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Risk Prediction</span>
                        <span className="text-yellow-600">91.6% accuracy</span>
                      </div>
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
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Loan Portfolio Quality</h4>
                    <p className="text-sm text-green-700">23% reduction in default rates through AI-enhanced risk assessment</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Processing Efficiency</h4>
                    <p className="text-sm text-blue-700">45% faster application processing with automated AI analysis</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Financial Inclusion</h4>
                    <p className="text-sm text-purple-700">12% increase in approved loans for previously underserved borrowers</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">Rp 2.3B</div>
                      <div className="text-sm text-muted-foreground">Loans Disbursed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">156</div>
                      <div className="text-sm text-muted-foreground">Borrowers Helped</div>
                    </div>
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
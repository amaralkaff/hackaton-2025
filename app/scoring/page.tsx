"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  Camera,
  FileText,
  Brain,
  Calculator,
  Target,
  CheckCircle,
  AlertTriangle,
  User,
  DollarSign
} from "lucide-react"

export default function ScoringPage() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">New Credit Application</h1>
            <p className="text-muted-foreground">Process borrower application with Amara AI multimodal analysis</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${activeStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              1
            </div>
            <span className={`text-sm ${activeStep >= 1 ? "text-foreground" : "text-muted-foreground"}`}>Basic Info</span>
          </div>
          <div className="flex-1 h-1 bg-muted mx-2">
            <div className={`h-full ${activeStep >= 2 ? "bg-primary" : ""}`} style={{ width: activeStep >= 2 ? "100%" : "0%" }} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${activeStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              2
            </div>
            <span className={`text-sm ${activeStep >= 2 ? "text-foreground" : "text-muted-foreground"}`}>Upload Data</span>
          </div>
          <div className="flex-1 h-1 bg-muted mx-2">
            <div className={`h-full ${activeStep >= 3 ? "bg-primary" : ""}`} style={{ width: activeStep >= 3 ? "100%" : "0%" }} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${activeStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              3
            </div>
            <span className={`text-sm ${activeStep >= 3 ? "text-foreground" : "text-muted-foreground"}`}>AI Analysis</span>
          </div>
          <div className="flex-1 h-1 bg-muted mx-2">
            <div className={`h-full ${activeStep >= 4 ? "bg-primary" : ""}`} style={{ width: activeStep >= 4 ? "100%" : "0%" }} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${activeStep >= 4 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              4
            </div>
            <span className={`text-sm ${activeStep >= 4 ? "text-foreground" : "text-muted-foreground"}`}>Results</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Borrower Information</CardTitle>
                <CardDescription>Enter basic borrower and business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="Ibu Ratna" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age</label>
                    <Input type="number" placeholder="38" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Type</label>
                    <Input placeholder="Home-based snack business" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input placeholder="Desa Sukamaju, West Java" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Monthly Income Claimed</label>
                    <Input type="number" placeholder="3500000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Loan Amount Requested</label>
                    <Input type="number" placeholder="8000000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Description</label>
                  <Input placeholder="Making fried snacks for neighbors, wants to expand production" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Multimodal Data</CardTitle>
                <CardDescription>Upload business photos, house photos, and field agent notes for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium mb-1">Business Photo</p>
                    <p className="text-xs text-gray-500 mb-3">Upload business premises photo</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium mb-1">House Photo</p>
                    <p className="text-xs text-gray-500 mb-3">Upload residential property photo</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium mb-1">Field Agent Notes</p>
                  <p className="text-xs text-gray-500 mb-3">Upload field visitation report</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={() => setActiveStep(Math.min(4, activeStep + 1))}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                Process with Amara AI
              </Button>
              <Button variant="outline">Save Draft</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>

          {/* Right Column - AI Analysis Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Analysis Preview
                </CardTitle>
                <CardDescription>Real-time AI insights from multimodal data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Upload photos and documents to enable AI analysis
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Gemini Vision</span>
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">Ready</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Gemini NLP</span>
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">Ready</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">ML Baseline Model</span>
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expected Results</CardTitle>
                <CardDescription>What Amara AI will provide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Credit Score</p>
                      <p className="text-xs text-muted-foreground">Traditional + AI-enhanced scoring</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Income Reality Check</p>
                      <p className="text-xs text-muted-foreground">Claimed vs AI-estimated income</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Risk Assessment</p>
                      <p className="text-xs text-muted-foreground">Multimodal risk indicators</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">Loan Recommendation</p>
                      <p className="text-xs text-muted-foreground">AI-powered loan amount suggestion</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
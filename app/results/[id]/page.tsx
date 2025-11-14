"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, TrendingUp, AlertCircle, DollarSign, Brain, FileText, Home, Building2, ChevronRight, Download } from "lucide-react"

interface AnalysisStep {
  id: string
  title: string
  description: string
  icon: any
  progress: number
  status: 'pending' | 'processing' | 'completed'
  result?: any
}

export default function ResultsPage() {
  const params = useParams()
  const applicationId = params?.id as string
  const [currentStep, setCurrentStep] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)

  const [steps, setSteps] = useState<AnalysisStep[]>([
    {
      id: 'step1',
      title: 'Data Processing',
      description: 'Analyzing uploaded documents and images',
      icon: FileText,
      progress: 0,
      status: 'pending'
    },
    {
      id: 'step2',
      title: 'Gemini Vision Analysis',
      description: 'AI analyzing business and house photos',
      icon: Brain,
      progress: 0,
      status: 'pending'
    },
    {
      id: 'step3',
      title: 'Gemini NLP Analysis',
      description: 'Processing field agent notes and text data',
      icon: FileText,
      progress: 0,
      status: 'pending'
    },
    {
      id: 'step4',
      title: 'ML Baseline Scoring',
      description: 'Traditional credit scoring calculation',
      icon: TrendingUp,
      progress: 0,
      status: 'pending'
    },
    {
      id: 'step5',
      title: 'Final Assessment',
      description: 'Generating loan recommendation',
      icon: DollarSign,
      progress: 0,
      status: 'pending'
    }
  ])

  // Mock data for results
  const [results] = useState({
    borrower: {
      name: "Ibu Siti Rahayu",
      business: "Warung Makan (Small Restaurant)",
      location: "Batang Kuis, North Sumatra",
      loanRequested: 15000000
    },
    creditScore: {
      traditional: 620,
      aiEnhanced: 685,
      improvement: 65,
      rating: "Good"
    },
    incomeReality: {
      claimed: 3500000,
      aiEstimated: 5800000,
      confidence: 87,
      variance: "+66%"
    },
    riskAssessment: {
      level: "Low-Medium",
      score: 7.2,
      factors: [
        { name: "Business Stability", score: 8.5, status: "positive" },
        { name: "Location Quality", score: 7.8, status: "positive" },
        { name: "Asset Ownership", score: 6.5, status: "neutral" },
        { name: "Market Competition", score: 5.9, status: "caution" }
      ]
    },
    loanRecommendation: {
      approved: true,
      recommendedAmount: 12000000,
      requestedAmount: 15000000,
      tenor: 24,
      interestRate: 1.5,
      monthlyPayment: 575000,
      reasoning: "Strong business fundamentals with proven 5-year track record. Recommend 80% of requested amount to maintain healthy debt-to-income ratio."
    }
  })

  // Simulate step-by-step processing
  useEffect(() => {
    let stepIndex = 0
    let stepProgress = 0

    const interval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(interval)
        return
      }

      if (stepProgress === 0) {
        // Start processing current step
        setCurrentStep(stepIndex)
        setSteps(prev => prev.map((step, idx) =>
          idx === stepIndex ? { ...step, status: 'processing' as const } : step
        ))
      }

      // Update progress
      stepProgress += 10
      setSteps(prev => prev.map((step, idx) =>
        idx === stepIndex ? { ...step, progress: stepProgress } : step
      ))
      setOverallProgress(((stepIndex * 100 + stepProgress) / steps.length))

      // Check if step completed
      if (stepProgress >= 100) {
        setSteps(prev => prev.map((step, idx) =>
          idx === stepIndex ? { ...step, status: 'completed' as const, progress: 100 } : step
        ))
        stepIndex++
        stepProgress = 0
      }
    }, 150)

    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
      case 'low-medium':
        return 'text-green-600 bg-green-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'high':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getFactorColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'text-green-600'
      case 'neutral':
        return 'text-yellow-600'
      case 'caution':
        return 'text-orange-600'
      default:
        return 'text-gray-600'
    }
  }

  const allStepsCompleted = steps.every(s => s.status === 'completed')

  return (
    <DashboardLayout title="AI Credit Analysis Results">
      <div className="space-y-6">
        {/* Borrower Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{results.borrower.name}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {results.borrower.business} • {results.borrower.location}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                Application ID: {applicationId}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Analysis Progress
            </CardTitle>
            <CardDescription>
              {allStepsCompleted ? 'Analysis Complete' : `Processing Step ${currentStep + 1} of ${steps.length}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Overall Progress</span>
                <span className="text-muted-foreground">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>

            {/* Step-by-step progress */}
            <div className="space-y-3 mt-6">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={step.id} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full
                        ${step.status === 'completed' ? 'bg-green-100 text-green-600' : ''}
                        ${step.status === 'processing' ? 'bg-blue-100 text-blue-600 animate-pulse' : ''}
                        ${step.status === 'pending' ? 'bg-gray-100 text-gray-400' : ''}
                      `}>
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-medium ${step.status === 'pending' ? 'text-muted-foreground' : ''}`}>
                              {step.title}
                            </p>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                          {step.status === 'processing' && (
                            <span className="text-sm text-blue-600 font-medium">{step.progress}%</span>
                          )}
                          {step.status === 'completed' && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        {step.status !== 'pending' && (
                          <Progress value={step.progress} className="h-1.5 mt-2" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Results - Only show when all steps completed */}
        {allStepsCompleted && (
          <>
            {/* Credit Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Credit Score Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Traditional Score</p>
                    <p className="text-4xl font-bold">{results.creditScore.traditional}</p>
                    <Badge variant="outline">Baseline Model</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">AI-Enhanced Score</p>
                    <p className="text-4xl font-bold text-green-600">{results.creditScore.aiEnhanced}</p>
                    <Badge className="bg-green-100 text-green-700">Multimodal AI</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Improvement</p>
                    <p className="text-4xl font-bold text-blue-600">+{results.creditScore.improvement}</p>
                    <Badge className="bg-blue-100 text-blue-700">{results.creditScore.rating}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Income Reality Check */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Income Reality Check
                </CardTitle>
                <CardDescription>Claimed vs AI-estimated income analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Claimed Monthly Income</p>
                        <p className="text-2xl font-bold">Rp {results.incomeReality.claimed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">AI-Estimated Income</p>
                        <p className="text-2xl font-bold text-green-600">
                          Rp {results.incomeReality.aiEstimated.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">AI Confidence</span>
                        <span className="text-sm font-medium">{results.incomeReality.confidence}%</span>
                      </div>
                      <Progress value={results.incomeReality.confidence} className="h-2" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-lg py-2 justify-center">
                      {results.incomeReality.variance} Higher than claimed
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Based on business photo analysis showing customer traffic and field agent observations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
                <CardDescription>Multimodal risk indicator analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Overall Risk Level</p>
                      <Badge className={getRiskColor(results.riskAssessment.level) + " text-lg px-4 py-2"}>
                        {results.riskAssessment.level}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-green-600">{results.riskAssessment.score}/10</p>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <p className="font-medium">Risk Factors Analysis</p>
                    {results.riskAssessment.factors.map((factor) => (
                      <div key={factor.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${getFactorColor(factor.status)}`}>
                            {factor.name}
                          </span>
                          <span className="text-sm text-muted-foreground">{factor.score}/10</span>
                        </div>
                        <Progress value={factor.score * 10} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loan Recommendation */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  Loan Recommendation
                </CardTitle>
                <CardDescription>AI-powered loan amount and terms suggestion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-700">Approved for Funding</p>
                      <p className="text-sm text-green-600">Based on comprehensive AI analysis</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Recommended Loan Amount</p>
                      <p className="text-3xl font-bold text-green-700">
                        Rp {results.loanRecommendation.recommendedAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        (80% of requested Rp {results.loanRecommendation.requestedAmount.toLocaleString()})
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tenor Period</span>
                        <span className="font-medium">{results.loanRecommendation.tenor} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Interest Rate</span>
                        <span className="font-medium">{results.loanRecommendation.interestRate}% / month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Payment</span>
                        <span className="font-medium text-lg">Rp {results.loanRecommendation.monthlyPayment.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">AI Reasoning</p>
                  <p className="text-sm text-blue-700">{results.loanRecommendation.reasoning}</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" size="lg">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Approve Loan
                  </Button>
                  <Button variant="outline" size="lg">
                    <Download className="mr-2 h-5 w-5" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

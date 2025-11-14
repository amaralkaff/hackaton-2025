"use client"

import { useState, useRef } from "react"
import { DashboardLayout } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  DollarSign,
  X,
  Image as ImageIcon
} from "lucide-react"
import { handleFileInputChange, formatFileSize, uploadFile } from "@/lib/upload-utils"
import { supabase } from "@/lib/supabase"

export default function ScoringPage() {
  const [activeStep, setActiveStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // File upload states
  const [businessPhoto, setBusinessPhoto] = useState<File | null>(null)
  const [housePhoto, setHousePhoto] = useState<File | null>(null)
  const [fieldNotes, setFieldNotes] = useState<File | null>(null)

  // File input refs
  const businessPhotoRef = useRef<HTMLInputElement>(null)
  const housePhotoRef = useRef<HTMLInputElement>(null)
  const fieldNotesRef = useRef<HTMLInputElement>(null)

  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    location: "",
    businessType: "",
    monthlyIncome: "",
    monthlyRevenue: "",
    loanAmount: "",
    businessDescription: "",
  })

  // File upload handlers
  const handleBusinessPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInputChange(e, {
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
      maxSizeMB: 5,
      onSuccess: (files) => {
        setBusinessPhoto(files[0])
        setError(null)
      },
      onError: (error) => {
        setError(error)
        if (businessPhotoRef.current) businessPhotoRef.current.value = ''
      }
    })
  }

  const handleHousePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInputChange(e, {
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
      maxSizeMB: 5,
      onSuccess: (files) => {
        setHousePhoto(files[0])
        setError(null)
      },
      onError: (error) => {
        setError(error)
        if (housePhotoRef.current) housePhotoRef.current.value = ''
      }
    })
  }

  const handleFieldNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInputChange(e, {
      allowedTypes: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      maxSizeMB: 10,
      onSuccess: (files) => {
        setFieldNotes(files[0])
        setError(null)
      },
      onError: (error) => {
        setError(error)
        if (fieldNotesRef.current) fieldNotesRef.current.value = ''
      }
    })
  }

  // Handle form submission with AI processing
  const handleProcessWithAI = async () => {
    setProcessing(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.fullName || !formData.location || !formData.businessType || !formData.loanAmount) {
        throw new Error('Please fill in all required fields')
      }

      // Upload files to Supabase Storage if provided
      let businessPhotoUrl = null
      let housePhotoUrl = null
      let fieldNotesUrl = null

      if (businessPhoto) {
        const result = await uploadFile(businessPhoto, 'borrower-documents', 'business-photos')
        if (!result.success) throw new Error(result.error || 'Failed to upload business photo')
        businessPhotoUrl = result.url
      }

      if (housePhoto) {
        const result = await uploadFile(housePhoto, 'borrower-documents', 'house-photos')
        if (!result.success) throw new Error(result.error || 'Failed to upload house photo')
        housePhotoUrl = result.url
      }

      if (fieldNotes) {
        const result = await uploadFile(fieldNotes, 'borrower-documents', 'field-notes')
        if (!result.success) throw new Error(result.error || 'Failed to upload field notes')
        fieldNotesUrl = result.url
      }

      // Create borrower record
      const { data, error: dbError } = await supabase
        .from('borrowers')
        .insert({
          name: formData.fullName,
          email: formData.email || null,
          phone: formData.phone || null,
          business: formData.businessType,
          location: formData.location,
          loan_amount: parseInt(formData.loanAmount),
          credit_score: null, // Will be calculated by AI
          status: 'pending',
          risk_level: null, // Will be determined by AI
          ai_score: null, // Will be calculated by AI
        })
        .select()
        .single()

      if (dbError) throw dbError

      // Simulate AI processing
      setActiveStep(3)
      setTimeout(() => {
        // Mock AI results
        setActiveStep(4)
        setProcessing(false)
      }, 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process application')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="New Credit Application">
        <div className="flex-1 space-y-8 p-8">
          {/* Header Skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-96" />
          </div>

          {/* Progress Steps Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-1 flex-1 mx-2" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-1 flex-1 mx-2" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-1 flex-1 mx-2" />
            <Skeleton className="h-8 w-32" />
          </div>

          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                  </div>
                  <Skeleton className="h-32 w-full rounded-lg" />
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="New Credit Application">
      <div className="flex-1 space-y-8 p-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section: Borrower Information */}
            <div className="space-y-6">
              <div className="pb-3 border-b">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <User className="h-6 w-6 text-chart-2" />
                  Borrower Information
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Enter basic borrower and business details</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="Ibu Ratna Sari"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ratna.sari@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+62 821-1111-1111"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="38"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      placeholder="Female"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="Desa Sukamaju, West Java"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Input
                      id="businessType"
                      placeholder="Food & Beverage"
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Monthly Income Claimed (Rp)</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      placeholder="3500000"
                      value={formData.monthlyIncome}
                      onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRevenue">Monthly Revenue (Rp)</Label>
                    <Input
                      id="monthlyRevenue"
                      type="number"
                      placeholder="4000000"
                      value={formData.monthlyRevenue}
                      onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount Requested (Rp) *</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="8000000"
                      value={formData.loanAmount}
                      onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="businessDescription">Business Description *</Label>
                  <Textarea
                    id="businessDescription"
                    placeholder="Home-based snack business, making fried snacks for neighbors"
                    value={formData.businessDescription}
                    onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: Upload Multimodal Data */}
            <div className="space-y-6">
              <div className="pb-3 border-b">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Upload className="h-6 w-6 text-chart-2" />
                  Upload Multimodal Data
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Upload business photos, house photos, and field agent notes for AI analysis</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Business Photo Upload */}
                  <div className="group relative border-2 border-dashed border-border hover:border-chart-2 bg-muted/30 hover:bg-muted/50 rounded-xl p-6 transition-all cursor-pointer" onClick={() => !businessPhoto && businessPhotoRef.current?.click()}>
                    {businessPhoto ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-chart-1/10 rounded-lg">
                              <ImageIcon className="h-5 w-5 text-chart-1" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{businessPhoto.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(businessPhoto.size)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setBusinessPhoto(null)
                              if (businessPhotoRef.current) businessPhotoRef.current.value = ''
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); businessPhotoRef.current?.click() }}>
                          <Upload className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="p-3 bg-chart-2/10 rounded-full w-fit mx-auto mb-3">
                          <Camera className="h-8 w-8 text-chart-2" />
                        </div>
                        <p className="text-sm font-semibold mb-1">Business Photo</p>
                        <p className="text-xs text-muted-foreground mb-4">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG or WebP (max. 5MB)</p>
                      </div>
                    )}
                    <input
                      ref={businessPhotoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBusinessPhotoChange}
                    />
                  </div>

                  {/* House Photo Upload */}
                  <div className="group relative border-2 border-dashed border-border hover:border-chart-2 bg-muted/30 hover:bg-muted/50 rounded-xl p-6 transition-all cursor-pointer" onClick={() => !housePhoto && housePhotoRef.current?.click()}>
                    {housePhoto ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-chart-1/10 rounded-lg">
                              <ImageIcon className="h-5 w-5 text-chart-1" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{housePhoto.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(housePhoto.size)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setHousePhoto(null)
                              if (housePhotoRef.current) housePhotoRef.current.value = ''
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); housePhotoRef.current?.click() }}>
                          <Upload className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="p-3 bg-chart-2/10 rounded-full w-fit mx-auto mb-3">
                          <User className="h-8 w-8 text-chart-2" />
                        </div>
                        <p className="text-sm font-semibold mb-1">House Photo</p>
                        <p className="text-xs text-muted-foreground mb-4">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG or WebP (max. 5MB)</p>
                      </div>
                    )}
                    <input
                      ref={housePhotoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleHousePhotoChange}
                    />
                  </div>
                </div>

                {/* Field Notes Upload */}
                <div className="group relative border-2 border-dashed border-border hover:border-chart-2 bg-muted/30 hover:bg-muted/50 rounded-xl p-6 transition-all cursor-pointer" onClick={() => !fieldNotes && fieldNotesRef.current?.click()}>
                  {fieldNotes ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-chart-1/10 rounded-lg">
                            <FileText className="h-5 w-5 text-chart-1" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{fieldNotes.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(fieldNotes.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFieldNotes(null)
                            if (fieldNotesRef.current) fieldNotesRef.current.value = ''
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); fieldNotesRef.current?.click() }}>
                        <Upload className="h-4 w-4 mr-2" />
                        Change Document
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="p-3 bg-chart-2/10 rounded-full w-fit mx-auto mb-3">
                        <FileText className="h-8 w-8 text-chart-2" />
                      </div>
                      <p className="text-sm font-semibold mb-1">Field Agent Notes</p>
                      <p className="text-xs text-muted-foreground mb-4">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PDF, TXT, DOC or DOCX (max. 10MB)</p>
                    </div>
                  )}
                  <input
                    ref={fieldNotesRef}
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    className="hidden"
                    onChange={handleFieldNotesChange}
                  />
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleProcessWithAI}
                disabled={processing}
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                {processing ? 'Processing...' : 'Process with Amara AI'}
              </Button>
              <Button variant="outline" disabled={processing}>Save Draft</Button>
              <Button variant="outline" disabled={processing}>Cancel</Button>
            </div>
          </div>

          {/* Right Column - AI Analysis Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  AI Analysis Preview
                </CardTitle>
                <CardDescription>Real-time AI insights from multimodal data</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {!businessPhoto && !housePhoto && !fieldNotes ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Upload photos and documents to enable AI analysis
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      {[businessPhoto, housePhoto, fieldNotes].filter(Boolean).length} file(s) uploaded and ready for AI processing
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Gemini Vision</span>
                    <span className={`text-xs px-2 py-1 rounded ${businessPhoto || housePhoto ? 'bg-chart-1/10 text-chart-1' : 'bg-muted text-muted-foreground'}`}>
                      {businessPhoto || housePhoto ? 'Active' : 'Ready'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Gemini NLP</span>
                    <span className={`text-xs px-2 py-1 rounded ${fieldNotes ? 'bg-chart-1/10 text-chart-1' : 'bg-muted text-muted-foreground'}`}>
                      {fieldNotes ? 'Active' : 'Ready'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">ML Baseline Model</span>
                    <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expected Results</CardTitle>
                <CardDescription>What Amara AI will provide</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Credit Score</p>
                      <p className="text-xs text-muted-foreground">Traditional + AI scoring</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-chart-1" />
                    <div>
                      <p className="text-sm font-medium">Income Reality Check</p>
                      <p className="text-xs text-muted-foreground">Claimed vs AI-estimated income</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">Risk Assessment</p>
                      <p className="text-xs text-muted-foreground">Multimodal risk indicators</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-chart-2" />
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
'use client'

import { useState } from 'react'
import { Upload, FileText, Settings, Download, CheckCircle, Clock, Zap, Shield, Users, Building, Calendar, DollarSign, Eye, Edit3, User, MapPin, PenTool, Target, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface CustomRule {
  id: string
  instruction: string
  category: 'term' | 'parties' | 'firm' | 'signature' | 'other'
}

interface FirmDetails {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  signerName: string
  signerTitle: string
  email: string
  phone: string
}

interface ProcessingStep {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  details?: string
}

export default function DemoPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  
  const [customRules, setCustomRules] = useState<CustomRule[]>([
    {
      id: '1',
      instruction: 'Change term length to 2 years if longer than 2 years',
      category: 'term'
    },
    {
      id: '2',
      instruction: 'Include investors, potential financing sources, and agents if not included',
      category: 'parties'
    },
    {
      id: '3',
      instruction: 'Cap confidentiality obligations at 18 months',
      category: 'term'
    },
    {
      id: '4',
      instruction: 'Limit liability to actual damages, exclude consequential damages',
      category: 'other'
    }
  ])

  const [firmDetails, setFirmDetails] = useState<FirmDetails>({
    name: 'Your Law Firm LLC',
    address: '123 Business Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    signerName: 'John Smith',
    signerTitle: 'Managing Partner',
    email: 'john.smith@yourfirm.com',
    phone: '(555) 123-4567'
  })

  const [processingSteps] = useState<ProcessingStep[]>([
    { 
      id: 'upload', 
      name: 'Document Analysis & Validation', 
      status: 'pending', 
      progress: 0,
      details: 'Analyzing NDA structure and content'
    },
    { 
      id: 'rules', 
      name: 'Applying Custom Instructions', 
      status: 'pending', 
      progress: 0,
      details: 'Processing user-defined redlining rules'
    },
    { 
      id: 'ai', 
      name: 'AI-Powered Redlining', 
      status: 'pending', 
      progress: 0,
      details: 'AI agent applying intelligent modifications'
    },
    { 
      id: 'firm', 
      name: 'Inserting Firm Details', 
      status: 'pending', 
      progress: 0,
      details: 'Adding firm information and signature blocks'
    },
    { 
      id: 'output', 
      name: 'Generating Redlined Document', 
      status: 'pending', 
      progress: 0,
      details: 'Creating final Word document with tracked changes'
    }
  ])

  const [newRule, setNewRule] = useState('')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setUploadedFile(file)
    }
  }

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSignatureFile(file)
    }
  }

  const addCustomRule = () => {
    if (newRule.trim()) {
      const rule: CustomRule = {
        id: Date.now().toString(),
        instruction: newRule.trim(),
        category: 'other'
      }
      setCustomRules(prev => [...prev, rule])
      setNewRule('')
    }
  }

  const removeCustomRule = (id: string) => {
    setCustomRules(prev => prev.filter(rule => rule.id !== id))
  }

  const updateFirmDetails = (field: keyof FirmDetails, value: string) => {
    setFirmDetails(prev => ({ ...prev, [field]: value }))
  }

  const startProcessing = async () => {
    if (!uploadedFile) return
    
    setIsProcessing(true)
    setCurrentStep(0)
    
    // Simulate realistic processing with AI agent details
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentStep(i)
      
      // Simulate different processing times for each step
      const stepTime = i === 2 ? 3000 : 1500 // AI step takes longer
      await new Promise(resolve => setTimeout(resolve, stepTime))
    }
    
    setIsProcessing(false)
    setShowPreview(true)
  }

  const downloadDocument = () => {
    // Simulate download
    const link = document.createElement('a')
    link.href = '#'
    link.download = 'redlined-nda.docx'
    link.click()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'term': return <Calendar className="w-4 h-4 text-blue-400" />
      case 'parties': return <Users className="w-4 h-4 text-green-400" />
      case 'firm': return <Building className="w-4 h-4 text-purple-400" />
      case 'signature': return <PenTool className="w-4 h-4 text-orange-400" />
      default: return <Target className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E5E7EB]">
      {/* Header */}
      <header className="bg-[#0B1220]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-[#60A5FA] rounded-full animate-pulse" />
              <span className="text-xl font-semibold text-white">NDA Redline</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[#E5E7EB]/60">AI-Powered Demo</span>
              <Link href="/" className="text-[#60A5FA] hover:text-[#60A5FA]/80 transition-colors">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">AI-Powered NDA Redlining Demo</h1>
          <p className="text-xl text-[#E5E7EB]/80 max-w-3xl mx-auto">
            Upload your NDA, define custom redlining instructions, and watch AI apply intelligent modifications with tracked changes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Configuration */}
          <div className="space-y-8">
            {/* File Upload */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-[#60A5FA]" />
                Upload NDA Document
              </h2>
              
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[#60A5FA]/40 transition-colors">
                  <input
                    type="file"
                    accept=".docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-[#60A5FA]" />
                    <p className="text-lg font-medium text-white mb-2">Drop your NDA here</p>
                    <p className="text-[#E5E7EB]/60">or click to browse</p>
                    <p className="text-sm text-[#E5E7EB]/40 mt-2">Supports .docx files only</p>
                  </label>
                </div>
              ) : (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-[#60A5FA]" />
                    <div className="flex-1">
                      <p className="font-medium text-white">{uploadedFile.name}</p>
                      <p className="text-sm text-[#E5E7EB]/60">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-[#E5E7EB]/60 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Instructions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Edit3 className="w-5 h-5 mr-2 text-[#60A5FA]" />
                Custom Redlining Instructions
              </h2>
              
              <div className="space-y-4 mb-4">
                {customRules.map((rule) => (
                  <div key={rule.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getCategoryIcon(rule.category)}
                        <span className="text-[#E5E7EB] text-sm">{rule.instruction}</span>
                      </div>
                      <button
                        onClick={() => removeCustomRule(rule.id)}
                        className="text-[#E5E7EB]/60 hover:text-red-400 transition-colors ml-2"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder="Add custom instruction..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA]"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomRule()}
                />
                <button
                  onClick={addCustomRule}
                  className="px-4 py-2 bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white rounded font-medium transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Firm Details */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-[#60A5FA]" />
                Firm Information
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-[#E5E7EB]/60 mb-1">Firm Name</label>
                  <input
                    type="text"
                    value={firmDetails.name}
                    onChange={(e) => updateFirmDetails('name', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#E5E7EB]/60 mb-1">Address</label>
                  <input
                    type="text"
                    value={firmDetails.address}
                    onChange={(e) => updateFirmDetails('address', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#E5E7EB]/60 mb-1">City</label>
                  <input
                    type="text"
                    value={firmDetails.city}
                    onChange={(e) => updateFirmDetails('city', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#E5E7EB]/60 mb-1">State</label>
                  <input
                    type="text"
                    value={firmDetails.state}
                    onChange={(e) => updateFirmDetails('state', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#E5E7EB]/60 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={firmDetails.zipCode}
                    onChange={(e) => updateFirmDetails('zipCode', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#E5E7EB]/60 mb-1">Signer Name</label>
                  <input
                    type="text"
                    value={firmDetails.signerName}
                    onChange={(e) => updateFirmDetails('signerName', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#E5E7EB]/60 mb-1">Title</label>
                  <input
                    type="text"
                    value={firmDetails.signerTitle}
                    onChange={(e) => updateFirmDetails('signerTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#E5E7EB]/60 mb-1">Email</label>
                  <input
                    type="email"
                    value={firmDetails.email}
                    onChange={(e) => updateFirmDetails('email', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#E5E7EB]/60 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={firmDetails.phone}
                    onChange={(e) => updateFirmDetails('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA]"
                  />
                </div>
              </div>
            </div>

            {/* Signature Upload */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <PenTool className="w-5 h-5 mr-2 text-[#60A5FA]" />
                Digital Signature
              </h2>
              
              {!signatureFile ? (
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#60A5FA]/40 transition-colors">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={handleSignatureUpload}
                    className="hidden"
                    id="signature-upload"
                  />
                  <label htmlFor="signature-upload" className="cursor-pointer">
                    <PenTool className="w-8 h-8 mx-auto mb-2 text-[#60A5FA]" />
                    <p className="text-sm text-[#E5E7EB]/60">Upload signature image</p>
                  </label>
                </div>
              ) : (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <PenTool className="w-6 h-6 text-[#60A5FA]" />
                    <div className="flex-1">
                      <p className="font-medium text-white">{signatureFile.name}</p>
                      <p className="text-sm text-[#E5E7EB]/60">Signature uploaded</p>
                    </div>
                    <button
                      onClick={() => setSignatureFile(null)}
                      className="text-[#E5E7EB]/60 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Process Button */}
            <button
              onClick={startProcessing}
              disabled={!uploadedFile || isProcessing}
              className="w-full bg-[#60A5FA] hover:bg-[#60A5FA]/90 disabled:bg-[#60A5FA]/40 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#60A5FA]/25 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  <span>AI Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Start AI Redlining Process</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column - Processing & Preview */}
          <div className="space-y-8">
            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-[#60A5FA]" />
                  AI Agent Processing Your NDA
                </h2>
                
                <div className="space-y-4">
                  {processingSteps.map((step, index) => (
                    <div key={step.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-[#E5E7EB]">{step.name}</span>
                          {index === currentStep && step.details && (
                            <p className="text-sm text-[#E5E7EB]/60 mt-1">{step.details}</p>
                          )}
                        </div>
                        {index === currentStep ? (
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-[#60A5FA] animate-pulse" />
                            <span className="text-xs text-[#60A5FA]">AI Working</span>
                          </div>
                        ) : index < currentStep ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-white/20 rounded-full" />
                        )}
                      </div>
                      
                      {index === currentStep && (
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (Date.now() % 2000) / 20)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview Section */}
            {showPreview && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-[#60A5FA]" />
                  AI-Redlined Document Preview
                </h2>
                
                <div className="bg-white rounded-lg p-6 shadow-2xl mb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-red-200 rounded w-2/3 border-l-4 border-red-500" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                    <div className="h-4 bg-blue-200 rounded w-1/2 border-l-4 border-blue-500" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-green-200 rounded w-5/6 border-l-4 border-green-500" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-purple-200 rounded w-4/5 border-l-4 border-purple-500" />
                  </div>
                </div>
                
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-[#E5E7EB]">Term length reduced to 2 years</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-[#E5E7EB]">Investors and agents added to parties</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-[#E5E7EB]">Firm details and signature inserted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span className="text-[#E5E7EB]">Confidentiality capped at 18 months</span>
                  </div>
                </div>
                
                <button
                  onClick={downloadDocument}
                  className="w-full bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#60A5FA]/25 flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Redlined NDA</span>
                </button>
              </div>
            )}

            {/* AI Capabilities */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-[#60A5FA]" />
                AI Agent Capabilities
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Target className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-[#E5E7EB]">Custom instruction processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-[#E5E7EB]">Smart party detection & inclusion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-[#E5E7EB]">Automatic firm detail insertion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <PenTool className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-[#E5E7EB]">Signature block completion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-[#E5E7EB]">Term duration optimization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-[#E5E7EB]">Liability clause analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

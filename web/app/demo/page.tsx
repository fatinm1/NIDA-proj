'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, FileText, Settings, Download, CheckCircle, Zap, Users, Building, Calendar, DollarSign, Eye, Edit3, User, MapPin, PenTool, Target, Sparkles, AlertCircle, X, BookOpen, Loader, Lock } from 'lucide-react'
import Link from 'next/link'
import { apiClient, Document, CustomRule, FirmDetails } from '@/lib/api'

interface ProcessingStep {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  details?: string
}

export default function DemoPage() {
  const [userId, setUserId] = useState('1') // Default to admin (ID: 1)
  const [userRole, setUserRole] = useState('admin') // Default to admin role
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Role-specific document states
  const [adminUploadedFile, setAdminUploadedFile] = useState<File | null>(null)
  const [adminUploadedDocument, setAdminUploadedDocument] = useState<Document | null>(null)
  const [adminProcessingResult, setAdminProcessingResult] = useState<any>(null)
  
  const [userUploadedFile, setUserUploadedFile] = useState<File | null>(null)
  const [userUploadedDocument, setUserUploadedDocument] = useState<Document | null>(null)
  const [userProcessingResult, setUserProcessingResult] = useState<any>(null)
  
  // Mock user ID for demo (in real app, this would come from auth context)
  // const [userId] = useState('1')
  
  const [customRules, setCustomRules] = useState<CustomRule[]>([
    {
      instruction: 'Change term length to 2 years if longer than 2 years',
      category: 'term'
    },
    {
      instruction: 'Include investors, potential financing sources, and agents if not included',
      category: 'parties'
    },
    {
      instruction: 'Cap confidentiality obligations at 18 months',
      category: 'term'
    },
    {
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
      name: userRole === 'admin' ? 'Applying Custom Instructions' : 'Standard Processing', 
      status: 'pending', 
      progress: 0,
      details: userRole === 'admin' ? 'Processing user-defined redlining rules' : 'Using standard legal practices'
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
  const [newRuleCategory, setNewRuleCategory] = useState('other')
  const [showAdminRuleModal, setShowAdminRuleModal] = useState(false)
  const [adminRuleName, setAdminRuleName] = useState('')
  const [adminRuleInstruction, setAdminRuleInstruction] = useState('')
  const [adminRuleCategory, setAdminRuleCategory] = useState('other')
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    role: 'USER',
    password: ''
  })
  const adminRuleModalRef = useRef<HTMLDivElement>(null)
  const addUserModalRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle click outside modals to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      if (showAdminRuleModal && adminRuleModalRef.current && !adminRuleModalRef.current.contains(target)) {
        setShowAdminRuleModal(false)
      }
      if (showAddUserModal && addUserModalRef.current && !addUserModalRef.current.contains(target)) {
        setShowAddUserModal(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowAdminRuleModal(false)
        setShowAddUserModal(false)
      }
    }

    if (showAdminRuleModal || showAddUserModal) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showAdminRuleModal, showAddUserModal])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      if (userRole === 'admin') {
        setAdminUploadedFile(file)
        setUserUploadedFile(null) // Clear user file when admin uploads
      } else {
        setUserUploadedFile(file)
        setAdminUploadedFile(null) // Clear admin file when user uploads
      }
      setError(null)
    } else {
      setError('Please select a valid .docx file')
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
        instruction: newRule.trim(),
        category: newRuleCategory
      }
      setCustomRules(prev => [...prev, rule])
      setNewRule('')
      setNewRuleCategory('other')
    }
  }

  const removeCustomRule = (index: number) => {
    setCustomRules(prev => prev.filter((_, i) => i !== index))
  }

  const createAdminRule = async () => {
    if (!adminRuleName.trim() || !adminRuleInstruction.trim()) {
      setError('Rule name and instruction are required')
      return
    }

    try {
      // For demo purposes, add to local state
      const newRule: CustomRule = {
        name: adminRuleName,
        category: adminRuleCategory,
        instruction: adminRuleInstruction
      }
      
      setCustomRules(prev => [...prev, newRule])
      
      // Clear form and close modal
      setAdminRuleName('')
      setAdminRuleInstruction('')
      setAdminRuleCategory('other')
      setShowAdminRuleModal(false)
      
      // Show success message
      setError(null)
      setSuccess('Rule created successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to create rule')
    }
  }

  const addNewUser = async () => {
    if (!newUserData.username.trim() || !newUserData.email.trim() || !newUserData.password.trim()) {
      setError('Username, email, and password are required')
      return
    }

    try {
      // For demo purposes, show success message
      setError(null)
      setSuccess(`User "${newUserData.username}" created successfully!`)
      
      // Clear form and close modal
      setNewUserData({
        username: '',
        email: '',
        role: 'USER',
        password: ''
      })
      setShowAddUserModal(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to create user')
    }
  }

  const updateFirmDetails = (field: keyof FirmDetails, value: string) => {
    setFirmDetails(prev => ({ ...prev, [field]: value }))
  }

  const uploadDocument = async (): Promise<Document | null> => {
    const currentFile = getCurrentUploadedFile()
    if (!currentFile) return null

    try {
      const result = await apiClient.uploadDocument(currentFile, userId)
      return result.document
    } catch (err: any) {
      setError(err.message || 'Failed to upload document')
      return null
    }
  }

  const startProcessing = async () => {
    const currentFile = getCurrentUploadedFile()
    if (!currentFile) return
    
    setIsProcessing(true)
    setCurrentStep(0)
    setError(null)
    
    try {
      // Step 1: Upload document
      setCurrentStep(0)
      const document = await uploadDocument()
      if (!document) {
        throw new Error('Failed to upload document')
      }
      
      // Update role-specific document state
      if (userRole === 'admin') {
        setAdminUploadedDocument(document)
      } else {
        setUserUploadedDocument(document)
      }
      
      // Step 2: Determine rules to use based on user role
      setCurrentStep(1)
      let rulesToUse: CustomRule[] = []
      
      if (userRole === 'admin') {
        // Admins can use their custom rules
        rulesToUse = customRules
      }
      // Regular users get no rules (empty array)
      
      // Step 3: Process document with AI
      setCurrentStep(2)
      
      const result = await apiClient.processDocument(
        document.id,
        rulesToUse,
        firmDetails,
        userId
      )
      
      // Update the role-specific document state with the processing result
      if (result.document) {
        if (userRole === 'admin') {
          setAdminUploadedDocument(result.document)
        } else {
          setUserUploadedDocument(result.document)
        }
      }
      
      // Update role-specific processing result
      if (userRole === 'admin') {
        setAdminProcessingResult(result.processing_result)
      } else {
        setUserProcessingResult(result.processing_result)
      }
      
      setCurrentStep(4) // Mark as completed
      
      // Wait a moment to show completion
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsProcessing(false)
      setShowPreview(true)
      
    } catch (err: any) {
      setError(err.message || 'Processing failed')
      setIsProcessing(false)
      setCurrentStep(0)
    }
  }

  const downloadDocument = async () => {
    const currentDoc = getCurrentUploadedDocument()
    if (!currentDoc?.output_path) {
      setError('No processed document available for download')
      return
    }

    try {
      await apiClient.downloadDocument(currentDoc.id, userId)
    } catch (err: any) {
      setError(`Download failed: ${err.message}`)
    }
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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'term': return 'Term Duration'
      case 'parties': return 'Parties'
      case 'firm': return 'Firm Details'
      case 'signature': return 'Signature'
      default: return 'Other'
    }
  }

  const getCurrentUploadedFile = () => {
    return userRole === 'admin' ? adminUploadedFile : userUploadedFile;
  }

  const clearCurrentUploadedFile = () => {
    if (userRole === 'admin') {
      setAdminUploadedFile(null);
    } else {
      setUserUploadedFile(null);
    }
  }

  const getCurrentUploadedDocument = () => {
    return userRole === 'admin' ? adminUploadedDocument : userUploadedDocument;
  }

  const getCurrentProcessingResult = () => {
    return userRole === 'admin' ? adminProcessingResult : userProcessingResult;
  }

  const clearAllState = () => {
    // Clear all document and processing state
    setAdminUploadedFile(null)
    setAdminUploadedDocument(null)
    setAdminProcessingResult(null)
    setUserUploadedFile(null)
    setUserUploadedDocument(null)
    setUserProcessingResult(null)
    setIsProcessing(false)
    setCurrentStep(0)
    setShowPreview(false)
    setError(null)
    setSuccess(null)
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
              
              {/* Role Switcher */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#E5E7EB]/60">Role:</span>
                <select
                  value={userId}
                  onChange={(e) => {
                    const newUserId = e.target.value
                    setUserId(newUserId)
                    setUserRole(newUserId === '1' ? 'admin' : 'user')
                    clearAllState() // Clear state when switching roles
                  }}
                  className="bg-[#1F2937] border border-white/20 rounded-md px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                >
                  <option value="1">Admin (ID: 1)</option>
                  <option value="2">User (ID: 2)</option>
                </select>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  userRole === 'admin' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  {userRole.toUpperCase()}
                </span>
              </div>
              
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

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-500/20 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400">{success}</span>
            </div>
          </div>
        )}

        {/* Admin Section - Only visible to admins */}
        {userRole === 'admin' && (
          <div className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#60A5FA]" />
              Admin Dashboard
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* System Statistics */}
              <div className="bg-[#1F2937] rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-3">System Overview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/60">Total Users:</span>
                    <span className="text-white">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/60">Total Documents:</span>
                    <span className="text-white">-</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#E5E7EB]/60">Custom Rules:</span>
                    <span className="text-white">{customRules.length}</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-[#1F2937] rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setShowAdminRuleModal(true)}
                    className="w-full bg-[#60A5FA] hover:bg-[#60A5FA]/80 text-white px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    Create Global Rule
                  </button>
                  <button 
                    onClick={() => setShowAddUserModal(true)}
                    className="w-full bg-[#10B981] hover:bg-[#10B981]/80 text-white px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    Add New User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Configuration */}
          <div className="space-y-8">
            {/* File Upload */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-[#60A5FA]" />
                Upload NDA Document
              </h2>
              
              {!getCurrentUploadedFile() ? (
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[#60A5FA]/40 transition-colors">
                  <input
                    type="file"
                    accept=".docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    ref={fileInputRef}
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
                      <p className="font-medium text-white">{getCurrentUploadedFile()?.name}</p>
                      <p className="text-sm text-[#E5E7EB]/60">
                        {getCurrentUploadedFile() ? (getCurrentUploadedFile()!.size / 1024 / 1024).toFixed(2) : 0} MB
                      </p>
                    </div>
                    <button
                      onClick={() => clearCurrentUploadedFile()}
                      className="text-[#E5E7EB]/60 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Rules - Only visible to admins */}
            {userRole === 'admin' && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-[#60A5FA]" />
                  Custom Redlining Rules
                </h2>
                
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <select
                      value={newRuleCategory}
                      onChange={(e) => setNewRuleCategory(e.target.value)}
                      className="flex-1 bg-[#1F2937] border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                    >
                      <option value="term">Term Duration</option>
                      <option value="parties">Parties</option>
                      <option value="firm">Firm Details</option>
                      <option value="signature">Signature</option>
                      <option value="other">Other</option>
                    </select>
                    <input
                      type="text"
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      placeholder="Enter redlining instruction..."
                      className="flex-1 bg-[#1F2937] border border-white/20 rounded-md px-3 py-2 text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                    />
                    <button
                      onClick={addCustomRule}
                      className="bg-[#60A5FA] hover:bg-[#60A5FA]/80 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Add Rule
                    </button>
                  </div>
                  
                  {/* Display custom rules */}
                  {customRules.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-[#E5E7EB]/80">Active Rules:</h3>
                      {customRules.map((rule, index) => (
                        <div key={index} className="flex items-center justify-between bg-[#1F2937] rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            {getCategoryIcon(rule.category)}
                            <div>
                              {rule.name && (
                                <div className="text-sm font-medium text-white">{rule.name}</div>
                              )}
                              <span className="text-sm text-[#E5E7EB]">{rule.instruction}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeCustomRule(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rules Display - Shows custom rules created by admin */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-[#60A5FA]" />
                Redlining Rules
              </h2>
              
              <div className="space-y-3">
                {customRules.length > 0 ? (
                  customRules.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-[#1F2937] rounded-lg p-3">
                      {getCategoryIcon(rule.category)}
                      <div className="flex-1">
                        {rule.name && (
                          <div className="text-sm font-medium text-white mb-1">{rule.name}</div>
                        )}
                        <span className="text-sm text-[#E5E7EB]">{rule.instruction}</span>
                        <span className="ml-2 text-xs text-[#E5E7EB]/60">({getCategoryLabel(rule.category)})</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-[#E5E7EB]/40" />
                    <p className="text-[#E5E7EB]/60">
                      {userRole === 'admin' 
                        ? 'No custom rules added yet. Create rules above to customize redlining behavior.'
                        : 'No redlining rules available. Contact your administrator to set up rules.'
                      }
                    </p>
                  </div>
                )}
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

            {/* Process Button */}
            <button
              onClick={startProcessing}
              disabled={!getCurrentUploadedFile() || isProcessing}
              className="w-full bg-[#60A5FA] hover:bg-[#60A5FA]/90 disabled:bg-[#60A5FA]/40 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#60A5FA]/25 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
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
                
                {getCurrentProcessingResult() && (
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
                )}
                
                <button
                  onClick={downloadDocument}
                  disabled={!getCurrentUploadedDocument()?.output_path}
                  className="w-full bg-[#10B981] hover:bg-[#10B981]/90 disabled:bg-[#10B981]/40 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#10B981]/25 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    {getCurrentUploadedDocument()?.output_path 
                      ? 'Download Redlined Document' 
                      : 'No processed document available for download'
                    }
                  </span>
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
                  <Lock className="w-4 h-4 text-[#60A5FA]" />
                  <span className="text-[#E5E7EB]">Liability clause analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Rule Creation Modal */}
      {showAdminRuleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div ref={adminRuleModalRef} className="bg-[#1F2937] rounded-xl p-6 w-full max-w-md mx-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Create New Redlining Rule</h3>
              <button
                onClick={() => setShowAdminRuleModal(false)}
                className="text-[#E5E7EB]/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                  Rule Name
                </label>
                <input
                  type="text"
                  value={adminRuleName}
                  onChange={(e) => setAdminRuleName(e.target.value)}
                  placeholder="Enter rule name..."
                  className="w-full bg-[#374151] border border-white/20 rounded-md px-3 py-2 text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                  Category
                </label>
                <select
                  value={adminRuleCategory}
                  onChange={(e) => setAdminRuleCategory(e.target.value)}
                  className="w-full bg-[#374151] border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                >
                  <option value="term">Term Duration</option>
                  <option value="parties">Parties</option>
                  <option value="firm">Firm Details</option>
                  <option value="signature">Signature</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                  Redlining Instruction
                </label>
                <textarea
                  value={adminRuleInstruction}
                  onChange={(e) => setAdminRuleInstruction(e.target.value)}
                  placeholder="Enter detailed redlining instruction..."
                  rows={3}
                  className="w-full bg-[#374151] border border-white/20 rounded-md px-3 py-2 text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] resize-none"
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowAdminRuleModal(false)}
                  className="flex-1 bg-[#6B7280] hover:bg-[#6B7280]/80 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createAdminRule}
                  className="flex-1 bg-[#60A5FA] hover:bg-[#60A5FA]/80 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Create Rule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div ref={addUserModalRef} className="bg-[#1F2937] rounded-xl p-6 w-full max-w-md mx-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-[#E5E7EB]/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={newUserData.username}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username..."
                  className="w-full bg-[#374151] border border-white/20 rounded-md px-3 py-2 text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email..."
                  className="w-full bg-[#374151] border border-white/20 rounded-md px-3 py-2 text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                  Role
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-[#374151] border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                >
                  <option value="USER">Regular User</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password..."
                  className="w-full bg-[#374151] border border-white/20 rounded-md px-3 py-2 text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]"
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 bg-[#6B7280] hover:bg-[#6B7280]/80 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewUser}
                  className="flex-1 bg-[#10B981] hover:bg-[#10B981]/80 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Health Modal */}
      {/* This modal is removed as per the edit hint */}
    </div>
  )
}


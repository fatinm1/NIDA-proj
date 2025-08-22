'use client'

import { useState } from 'react'
import { Upload, FileText, Clock, CheckCircle, BarChart3, Settings, User, LogOut, Plus, Search, Filter, Calendar, DollarSign, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface NDADocument {
  id: string
  name: string
  status: 'processing' | 'completed' | 'error'
  uploadedAt: string
  processedAt?: string
  size: string
}

export default function DashboardPage() {
  const [documents] = useState<NDADocument[]>([
    {
      id: '1',
      name: 'Acme Corp NDA - Q1 2024.docx',
      status: 'completed',
      uploadedAt: '2024-01-15',
      processedAt: '2024-01-15',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Tech Startup Confidentiality Agreement.docx',
      status: 'processing',
      uploadedAt: '2024-01-14',
      size: '1.8 MB'
    },
    {
      id: '3',
      name: 'Partnership NDA - Joint Venture.docx',
      status: 'completed',
      uploadedAt: '2024-01-12',
      processedAt: '2024-01-12',
      size: '3.1 MB'
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'processing':
        return <Clock className="w-5 h-5 text-[#60A5FA] animate-pulse" />
      case 'error':
        return <div className="w-5 h-5 bg-red-500 rounded-full" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'processing':
        return 'bg-[#60A5FA]/20 text-[#60A5FA] border-[#60A5FA]/30'
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
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
              <span className="text-sm text-[#E5E7EB]/60">Dashboard</span>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-[#60A5FA]" />
                <span className="text-white">john.smith@yourfirm.com</span>
              </div>
              <button className="text-[#E5E7EB]/60 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, John</h1>
          <p className="text-[#E5E7EB]/60">Manage your NDA documents and AI redlining projects</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#E5E7EB]/60 mb-1">Total Documents</p>
                <p className="text-2xl font-bold text-white">24</p>
              </div>
              <div className="w-12 h-12 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#60A5FA]" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#E5E7EB]/60 mb-1">Processing</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#E5E7EB]/60 mb-1">Completed</p>
                <p className="text-2xl font-bold text-white">21</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#E5E7EB]/60 mb-1">Time Saved</p>
                <p className="text-2xl font-bold text-white">47h</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload New NDA */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-[#60A5FA]" />
                Upload New NDA
              </h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#60A5FA]/40 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-[#60A5FA]" />
                  <p className="text-sm text-[#E5E7EB]/60">Drop your NDA here</p>
                  <p className="text-xs text-[#E5E7EB]/40 mt-1">or click to browse</p>
                </div>
                
                <Link 
                  href="/demo" 
                  className="w-full bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-[#60A5FA]/25 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Try Interactive Demo</span>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left">
                  <Settings className="w-4 h-4 text-[#E5E7EB]/60" />
                  <span className="text-[#E5E7EB]">Custom Rules</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left">
                  <Shield className="w-4 h-4 text-[#E5E7EB]/60" />
                  <span className="text-[#E5E7EB]">Security Settings</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left">
                  <BarChart3 className="w-4 h-4 text-[#E5E7EB]/60" />
                  <span className="text-[#E5E7EB]">Analytics</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Document List */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Documents</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#E5E7EB]/40" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA] text-sm"
                    />
                  </div>
                  <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Filter className="w-4 h-4 text-[#E5E7EB]/60" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#60A5FA]" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-white mb-1">{doc.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-[#E5E7EB]/60">
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>Uploaded {doc.uploadedAt}</span>
                            {doc.processedAt && (
                              <>
                                <span>•</span>
                                <span>Processed {doc.processedAt}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                        {getStatusIcon(doc.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <Link 
                  href="/documents" 
                  className="inline-flex items-center space-x-2 text-[#60A5FA] hover:text-[#60A5FA]/80 transition-colors font-medium"
                >
                  <span>View All Documents</span>
                  <Plus className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

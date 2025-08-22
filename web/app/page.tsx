import Link from 'next/link'
import { Upload, Shield, FileText, Zap, CheckCircle, Lock, Eye } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E5E7EB] overflow-x-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#60A5FA]/10 via-transparent to-[#60A5FA]/5" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(96, 165, 250, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96, 165, 250, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0B1220]/80 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-[#60A5FA] rounded-full animate-pulse" />
              <span className="text-xl font-semibold text-white">NDA Redline</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#product" className="text-[#E5E7EB] hover:text-white transition-colors">Product</Link>
              <Link href="#how-it-works" className="text-[#E5E7EB] hover:text-white transition-colors">How it works</Link>
              <Link href="#security" className="text-[#E5E7EB] hover:text-white transition-colors">Security</Link>
              <Link href="/demo" className="text-[#E5E7EB] hover:text-white transition-colors">Demo</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Redline NDAs in minutes — not days.
          </h1>
          <p className="text-xl md:text-2xl text-[#E5E7EB] mb-12 max-w-4xl mx-auto leading-relaxed">
            Upload a .docx, apply your standard rules, and download a lawyer-friendly Word file with tracked changes.
          </p>
          <div className="flex justify-center">
            <Link href="/demo" className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 hover:bg-white/5">
              See 60-second demo
            </Link>
          </div>
        </div>
        
        {/* Hero Visual - NDA Mockup */}
        <div className="mt-20 relative">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-lg p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-red-200 rounded w-2/3 border-l-4 border-red-500" />
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                  <div className="h-4 bg-blue-200 rounded w-1/3 border-l-4 border-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#60A5FA]/10 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-[#60A5FA]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Precise by design</h3>
              <p className="text-[#E5E7EB] leading-relaxed">
                Rules cap terms, insert missing parties, and fill signatures automatically.
              </p>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#60A5FA]/10 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-[#60A5FA]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Lawyer-friendly output</h3>
              <p className="text-[#E5E7EB] leading-relaxed">
                Real Word tracked changes, ready to review and send to clients.
              </p>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#60A5FA]/10 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-[#60A5FA]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Private by default</h3>
              <p className="text-[#E5E7EB] leading-relaxed">
                Short retention windows, strict security, no model training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-[#60A5FA]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">1. Upload your NDA</h3>
              <p className="text-[#E5E7EB]">Simply drag and drop your .docx file</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-[#60A5FA]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">2. Apply rules</h3>
              <p className="text-[#E5E7EB]">Set terms, parties, and firm details</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-[#60A5FA]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">3. Download result</h3>
              <p className="text-[#E5E7EB]">Get your redlined Word doc with tracked changes</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/demo" className="inline-flex items-center bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#60A5FA]/25">
              Try the Interactive Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Spotlight */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">Deterministic + AI assist</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#60A5FA] flex-shrink-0" />
                  <span className="text-[#E5E7EB]">Cap confidentiality terms</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#60A5FA] flex-shrink-0" />
                  <span className="text-[#E5E7EB]">Auto-include key parties</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#60A5FA] flex-shrink-0" />
                  <span className="text-[#E5E7EB]">Signature block completion</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-[#60A5FA] flex-shrink-0" />
                  <span className="text-[#E5E7EB]">AI-tightened clauses</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="bg-white rounded-lg p-6 shadow-2xl">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-red-200 rounded w-2/3 border-l-4 border-red-500" />
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                    <div className="h-4 bg-blue-200 rounded w-1/2 border-l-4 border-blue-500" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Security and Privacy by Default</h2>
          <p className="text-xl text-[#E5E7EB] mb-12 max-w-3xl mx-auto leading-relaxed">
            Your documents are encrypted in transit, validated on upload, and deleted automatically after processing. Logs contain no raw contract text.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-[#60A5FA]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">TLS encryption</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-[#60A5FA]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Short retention</h3>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-[#60A5FA]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Scoped access</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-3 h-3 bg-[#60A5FA] rounded-full" />
              <span className="text-white font-semibold">NDA Redline</span>
            </div>
            <div className="flex space-x-8 text-sm">
              <Link href="#" className="text-[#E5E7EB]/60 hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="text-[#E5E7EB]/60 hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="text-[#E5E7EB]/60 hover:text-white transition-colors">Security</Link>
              <Link href="#" className="text-[#E5E7EB]/60 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-[#E5E7EB]/40">
            © 2024 NDA Redline. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

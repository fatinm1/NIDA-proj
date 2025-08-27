import Link from 'next/link'
import { Upload, Shield, FileText, Zap, CheckCircle, Lock, Eye, ArrowRight, Sparkles, Users, Building, Calendar, PenTool } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E5E7EB] overflow-x-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#60A5FA]/10 via-transparent to-[#60A5FA]/5" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(96, 165, 250, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96, 165, 250, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#60A5FA]/30 rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-[#60A5FA]/20 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-[#60A5FA]/25 rounded-full animate-pulse delay-2000" />
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
              <Link href="/login" className="text-[#E5E7EB] hover:text-white transition-colors">Login</Link>
              <Link href="/register" className="bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-[#60A5FA]/10 border border-[#60A5FA]/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#60A5FA]" />
              <span className="text-sm text-[#60A5FA] font-medium">AI-Powered Legal Tech</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Redline NDAs in minutes — not days.
            </h1>
            <p className="text-xl md:text-2xl text-[#E5E7EB] mb-12 max-w-4xl mx-auto leading-relaxed">
              Upload a .docx, apply your standard rules, and download a lawyer-friendly Word file with tracked changes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/demo" className="bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#60A5FA]/25 flex items-center justify-center space-x-2">
                <span>Try Demo</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/register" className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 hover:bg-white/5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
        
        {/* Enhanced Hero Visual - Professional NDA Mockup */}
        <div className="mt-20 relative">
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              {/* Main Document */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transform rotate-1 group-hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-lg p-8 shadow-2xl">
                  {/* Document Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div className="text-sm text-gray-500">NDA_Redline_Demo.docx</div>
                  </div>
                  
                  {/* Document Content with Better Mockup */}
                  <div className="space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                    <div className="h-5 bg-red-200 rounded w-2/3 border-l-4 border-red-500 flex items-center">
                      <span className="text-red-700 text-sm ml-2">Confidentiality term reduced from 5 years to 2 years</span>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-4/5" />
                    <div className="h-5 bg-blue-200 rounded w-1/3 border-l-4 border-blue-500 flex items-center">
                      <span className="text-blue-700 text-sm ml-2">Added: Investors and agents to parties section</span>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-5 bg-green-200 rounded w-2/3 border-l-4 border-green-500 flex items-center">
                      <span className="text-green-700 text-sm ml-2">Firm details and signature block inserted</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-[#60A5FA]/20 backdrop-blur-sm border border-[#60A5FA]/30 rounded-xl p-4 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[#60A5FA]" />
                  <span className="text-sm text-[#60A5FA] font-medium">AI Processed</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">Ready to Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Value Props */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#60A5FA]/10 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-[#60A5FA]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Precise by design</h3>
              <p className="text-[#E5E7EB] leading-relaxed">
                Rules cap terms, insert missing parties, and fill signatures automatically with AI precision.
              </p>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#60A5FA]/10 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-[#60A5FA]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Lawyer-friendly output</h3>
              <p className="text-[#E5E7EB] leading-relaxed">
                Real Word tracked changes with professional formatting, ready to review and send to clients.
              </p>
            </div>
            
            <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-[#60A5FA]/10 hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-[#60A5FA]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Private by default</h3>
              <p className="text-[#E5E7EB] leading-relaxed">
                Short retention windows, strict security protocols, and no model training on your documents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-10 h-10 text-[#60A5FA]" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#60A5FA] rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Upload your NDA</h3>
              <p className="text-[#E5E7EB]">Simply drag and drop your .docx file into our secure platform</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-[#60A5FA]" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#60A5FA] rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Apply rules</h3>
              <p className="text-[#E5E7EB]">Set confidentiality terms, parties, and firm details with our rule engine</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-10 h-10 text-[#60A5FA]" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#60A5FA] rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Download result</h3>
              <p className="text-[#E5E7EB]">Get your redlined Word doc with tracked changes and professional formatting</p>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Link href="/demo" className="inline-flex items-center bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#60A5FA]/25 group">
              <span>Try the Interactive Demo</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Feature Spotlight */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">Deterministic + AI assist</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-[#60A5FA]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Cap confidentiality terms</h4>
                    <p className="text-[#E5E7EB]/80 text-sm">Automatically reduce terms longer than your specified limit</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-[#60A5FA]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Auto-include key parties</h4>
                    <p className="text-[#E5E7EB]/80 text-sm">Ensure investors, agents, and financing sources are included</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PenTool className="w-4 h-4 text-[#60A5FA]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Signature block completion</h4>
                    <p className="text-[#E5E7EB]/80 text-sm">Automatically fill in firm details and signature blocks</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-[#60A5FA]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">AI-tightened clauses</h4>
                    <p className="text-[#E5E7EB]/80 text-sm">Intelligent clause optimization for better legal protection</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="bg-white rounded-lg p-6 shadow-2xl">
                  {/* Enhanced Document Mockup */}
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-red-200 rounded w-2/3 border-l-4 border-red-500 flex items-center">
                      <span className="text-red-700 text-xs ml-2">Term capped at 2 years</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-4/5" />
                    <div className="h-4 bg-blue-200 rounded w-1/2 border-l-4 border-blue-500 flex items-center">
                      <span className="text-blue-700 text-xs ml-2">Parties added</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-green-200 rounded w-2/3 border-l-4 border-green-500 flex items-center">
                      <span className="text-green-700 text-xs ml-2">Firm details inserted</span>
                    </div>
                  </div>
                  
                  {/* Status Indicators */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Processing complete</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Security Section */}
      <section id="security" className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Security and Privacy by Default</h2>
          <p className="text-xl text-[#E5E7EB] mb-12 max-w-3xl mx-auto leading-relaxed">
            Your documents are encrypted in transit, validated on upload, and deleted automatically after processing. Logs contain no raw contract text.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Lock className="w-10 h-10 text-[#60A5FA]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">TLS encryption</h3>
              <p className="text-[#E5E7EB]/60 text-sm">End-to-end encryption for all data transmission</p>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-10 h-10 text-[#60A5FA]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Short retention</h3>
              <p className="text-[#E5E7EB]/60 text-sm">Documents automatically deleted after 24 hours</p>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-[#60A5FA]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Scoped access</h3>
              <p className="text-[#E5E7EB]/60 text-sm">Role-based permissions and audit logging</p>
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

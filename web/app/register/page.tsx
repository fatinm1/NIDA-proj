'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Shield, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    firmName: '',
    agreeToTerms: false
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const router = useRouter()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!formData.firmName.trim()) newErrors.firmName = 'Firm name is required'
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          firmName: formData.firmName
        }),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        const error = await response.json()
        alert(error.error || 'Registration failed')
      }
    } catch (error) {
      alert('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
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
              <span className="text-sm text-[#E5E7EB]/60">Create Account</span>
              <Link href="/" className="text-[#60A5FA] hover:text-[#60A5FA]/80 transition-colors flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Registration Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#60A5FA]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-[#60A5FA]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
            <p className="text-[#E5E7EB]/60">Join thousands of legal professionals using AI-powered NDA redlining</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/20 transition-all duration-200 ${
                    errors.firstName ? 'border-red-500' : 'border-white/20 focus:border-[#60A5FA]'
                  }`}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/20 transition-all duration-200 ${
                    errors.lastName ? 'border-red-500' : 'border-white/20 focus:border-[#60A5FA]'
                  }`}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/20 transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-white/20 focus:border-[#60A5FA]'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Firm Name */}
            <div>
              <label htmlFor="firmName" className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                Law Firm Name
              </label>
              <input
                id="firmName"
                type="text"
                value={formData.firmName}
                onChange={(e) => handleInputChange('firmName', e.target.value)}
                required
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/20 transition-all duration-200 ${
                  errors.firmName ? 'border-red-500' : 'border-white/20 focus:border-[#60A5FA]'
                }`}
                placeholder="Your law firm name"
              />
              {errors.firmName && (
                <p className="text-red-400 text-sm mt-1">{errors.firmName}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/20 transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-white/20 focus:border-[#60A5FA]'
                  }`}
                  placeholder="Create password"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:ring-2 focus:ring-[#60A5FA]/20 transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/20 focus:border-[#60A5FA]'
                  }`}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3">
              <input
                id="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="w-4 h-4 mt-1 text-[#60A5FA] bg-white/10 border-white/20 rounded focus:ring-[#60A5FA]"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-[#E5E7EB]/80">
                I agree to the{' '}
                <Link href="/terms" className="text-[#60A5FA] hover:text-[#60A5FA]/80">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#60A5FA] hover:text-[#60A5FA]/80">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-red-400 text-sm mt-1">{errors.agreeToTerms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#60A5FA] hover:bg-[#60A5FA]/90 disabled:bg-[#60A5FA]/40 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#60A5FA]/25 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-sm text-[#E5E7EB]/60 mb-4">Already have an account?</p>
              <Link 
                href="/login" 
                className="inline-flex items-center space-x-2 text-[#60A5FA] hover:text-[#60A5FA]/80 transition-colors font-medium"
              >
                <span>Sign In</span>
                <CheckCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#60A5FA]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-[#60A5FA]" />
            </div>
            <h3 className="text-white font-medium mb-2">AI-Powered</h3>
            <p className="text-sm text-[#E5E7EB]/60">Intelligent document processing</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-white font-medium mb-2">Secure</h3>
            <p className="text-sm text-[#E5E7EB]/60">Enterprise-grade security</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-white font-medium mb-2">Professional</h3>
            <p className="text-sm text-[#E5E7EB]/60">Lawyer-ready output</p>
          </div>
        </div>
      </div>
    </div>
  )
}

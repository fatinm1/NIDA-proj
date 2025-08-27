'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Shield, Sparkles, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { register } from '@/lib/auth'
import { useAuth } from '@/lib/auth-context'

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
  const [submitError, setSubmitError] = useState('')
  const router = useRouter()
  const { login: authLogin, user, loading } = useAuth()

  // Handle all side effects in a single useEffect
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError('')
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
    setSubmitError('')
    
    try {
      const response = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        firmName: formData.firmName
      })
      
      // Use auth context to login
      authLogin(response.user)
      
      // Redirect to dashboard page
      router.push('/dashboard')
    } catch (error: any) {
      setSubmitError(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Single return statement with conditional rendering
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#E5E7EB]">
      {loading ? (
        // Loading state
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#60A5FA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-[#E5E7EB]/80">Loading...</p>
          </div>
        </div>
      ) : user ? (
        // Redirect state
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#60A5FA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-[#E5E7EB]/80">Redirecting to dashboard...</p>
          </div>
        </div>
      ) : (
        // Registration form
        <>
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
                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-[#E5E7EB]/60">Join NDA Redline and start processing documents</p>
              </div>

              {/* Error Display */}
              {submitError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-sm">{submitError}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA]/20 transition-all duration-200"
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA]/20 transition-all duration-200"
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                    )}
                  </div>
                </div>

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
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA]/20 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="firmName" className="block text-sm font-medium text-[#E5E7EB]/80 mb-2">
                    Firm Name
                  </label>
                  <input
                    id="firmName"
                    type="text"
                    value={formData.firmName}
                    onChange={(e) => handleInputChange('firmName', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA]/20 transition-all duration-200"
                    placeholder="Enter your firm name"
                  />
                  {errors.firmName && (
                    <p className="mt-1 text-sm text-red-400">{errors.firmName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA]/20 transition-all duration-200"
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-400">{errors.password}</p>
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-[#E5E7EB]/40 focus:outline-none focus:border-[#60A5FA] focus:ring-2 focus:ring-[#60A5FA]/20 transition-all duration-200"
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#60A5FA] bg-white/10 border-white/20 rounded focus:ring-[#60A5FA] focus:ring-2"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-[#E5E7EB]/80">
                    I agree to the{' '}
                    <a href="#" className="text-[#60A5FA] hover:text-[#60A5FA]/80 transition-colors">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-[#60A5FA] hover:text-[#60A5FA]/80 transition-colors">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-400">{errors.agreeToTerms}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#60A5FA] hover:bg-[#60A5FA]/80 disabled:bg-[#60A5FA]/40 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

              <div className="mt-6 text-center">
                <p className="text-[#E5E7EB]/60">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#60A5FA] hover:text-[#60A5FA]/80 transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

"use client"
import React, { useState } from 'react'
import { z } from "zod"
import { userLoginSchema } from '@/lib/zodSchema'
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from 'next/navigation'
import { authToken } from '@/lib/auth-hook'
import axios from 'axios'
import { Eye, EyeOff, Loader2, Mail, Lock, LogIn, AlertCircle, CheckCircle } from 'lucide-react'

export type FormLoginValues = z.infer<typeof userLoginSchema>

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormLoginValues>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onChange"
  })

  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string>("")
  const [success, setSuccess] = useState(false)

  const onSubmit: SubmitHandler<FormLoginValues> = async (data) => {
    setApiError("")
    setSuccess(false)

    try {
      const response = await axios.post<{ token: string; user: { success: boolean } }>("/api/auth/login", {
        email: data.email,
        password: data.password
      })

      if (response.data.user.success && response.data.token) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/")
        }, 1500)
      }





      
    } catch (error: any) {
      console.log(error)
      
      if (error.response?.data?.error) {
        setApiError(error.response.data.error)
      } else {
        setApiError("Login failed. Please check your credentials.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

       
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Login successful!</p>
                  <p className="text-green-600 text-sm">Redirecting to dashboard...</p>
                </div>
              </div>
            )}

           
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800">{apiError}</p>
              </div>
            )}

           
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 pl-11 border-2 rounded-xl transition-all duration-200 outline-none ${
                    errors.email 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-gray-200 bg-gray-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100'
                  }`}
                />
                <Mail className={`absolute left-3 top-3.5 w-5 h-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

           
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pl-11 pr-11 border-2 rounded-xl transition-all duration-200 outline-none ${
                    errors.password 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                      : 'border-gray-200 bg-gray-50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100'
                  }`}
                />
                <Lock className={`absolute left-3 top-3.5 w-5 h-5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

           
            <div className="flex justify-end">
              <a 
                href="/forgot-password" 
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors hover:underline"
              >
                Forgot your password?
              </a>
            </div>

            
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Signed In!
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>


          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a 
                href="/register" 
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:underline"
              >
                Create one here
              </a>
            </p>
          </div>
        </div>

        {/* Social Login Options */}
        {/* <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            
            <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
              </svg>
              GitHub
            </button>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default LoginForm
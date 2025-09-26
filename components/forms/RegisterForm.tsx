"use client"
import { userRegisterSchema } from '@/lib/zodSchema'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Eye, EyeOff, Loader2, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'

export type FormRegistrationValues = z.infer<typeof userRegisterSchema>

const RegisterForm = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormRegistrationValues>({
        mode: "onChange",
        resolver: zodResolver(userRegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    })
    const [showPassword, setShowPassword] = useState(false)
    const [apiError, setApiError] = useState<string>("")
    const [success, setSuccess] = useState(false)
    const router = useRouter();

    const onSubmit: SubmitHandler<FormRegistrationValues> = async (data) => {
        console.log(data)
        setApiError("")
        setSuccess(false)
        
        try {
            const res = await axios.post('/api/auth/register', { 
                name: data.name, 
                email: data.email, 
                password: data.password 
            })
            
            if (res.status === 201 || res.status === 200) {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/')
                }, 1500)
            }
        } catch (error: any) {
            console.log(error)
            
            if (error.response?.data?.error) {
                setApiError(error.response.data.error)
            } else {
                setApiError("Registration failed. Please try again.")
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join us and start your journey today</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <div>
                                    <p className="text-green-800 font-medium">Account created successfully!</p>
                                    <p className="text-green-600 text-sm">Redirecting to login...</p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {apiError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-red-800">{apiError}</p>
                            </div>
                        )}

                        {/* Name Field */}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    id="name"
                                    {...register("name")}
                                    type="text"
                                    placeholder="Enter your full name"
                                    className={`w-full px-4 py-3 pl-11 border-2 rounded-xl transition-all duration-200 outline-none ${
                                        errors.name 
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                                            : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'
                                    }`}
                                />
                                <User className={`absolute left-3 top-3.5 w-5 h-5 ${errors.name ? 'text-red-400' : 'text-gray-400'}`} />
                            </div>
                            {errors.name && (
                                <p className="text-red-600 text-sm flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
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
                                            : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'
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

                        {/* Password Field */}
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
                                    placeholder="Create a strong password"
                                    className={`w-full px-4 py-3 pl-11 pr-11 border-2 rounded-xl transition-all duration-200 outline-none ${
                                        errors.password 
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                                            : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || success}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Account Created!
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <a 
                                href="/login" 
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline"
                            >
                                Sign in here
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm
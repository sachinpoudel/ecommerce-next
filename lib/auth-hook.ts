"use client"
import { useState, useEffect } from 'react'
export const authToken = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/auth/me')
            setIsAuthenticated(response.ok)
        } catch {
            setIsAuthenticated(false)
        }
    }

    const login = async () => {
        setIsAuthenticated(true)
    }

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        setIsAuthenticated(false)
    }

    return { isAuthenticated, login, logout, checkAuthStatus }
}
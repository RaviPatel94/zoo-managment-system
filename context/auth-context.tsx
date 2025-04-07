"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("zoo_user")
      const storedToken = localStorage.getItem("zoo_auth_token")

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Failed to parse stored user:", error)
          localStorage.removeItem("zoo_user")
          localStorage.removeItem("zoo_auth_token")
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string, rememberMe: boolean) => {
    // In a real app, this would validate credentials with a backend
    // For demo purposes, we'll just simulate a successful login
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const user = { email }
        const token = `demo-token-${Date.now()}`

        setUser(user)
        setIsAuthenticated(true)

        // Always store the token for session persistence
        localStorage.setItem("zoo_auth_token", token)

        if (rememberMe) {
          localStorage.setItem("zoo_user", JSON.stringify(user))
        }

        resolve()
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("zoo_user")
    localStorage.removeItem("zoo_auth_token")
  }

  if (isLoading) {
    // You could return a loading spinner here if needed
    return null
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


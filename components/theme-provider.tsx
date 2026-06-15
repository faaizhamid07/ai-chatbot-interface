'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'clay' | 'glass'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('clay')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('claudium-theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = stored || 'clay'
    setThemeState(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
    setMounted(true)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('claudium-theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme === 'clay' ? 'glass' : 'clay')
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

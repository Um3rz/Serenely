"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Shield, Heart } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "./ui/Button"
import { useAuth } from "@/lib/hooks"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, isAdmin, logout } = useAuth()

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Journal", href: "/journal" },
    { name: "Community", href: "/post" },
    { name: "Therapist", href: "/therapist-log" },
  ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: 'rgba(11,15,26,0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2dd4bf, #0d9488)' }}
          >
            <Heart size={14} className="text-white" />
          </div>
          <span
            className="text-lg font-bold"
            style={{
              background: 'linear-gradient(135deg, #e8eaf0, #2dd4bf)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Serenely
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive ? '#2dd4bf' : '#94a3b8',
                  background: isActive ? 'rgba(45,212,191,0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(45,212,191,0.2)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = '#2dd4bf'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = '#94a3b8'
                }}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Auth Buttons — Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link href="/admin">
                  <div
                    className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}
                  >
                    <Shield size={16} />
                  </div>
                </Link>
              )}
              <Button
                onClick={logout}
                className="text-sm rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                  border: 'none',
                  color: '#fff',
                } as React.CSSProperties}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  variant="ghost"
                  className="text-sm"
                  style={{ color: '#94a3b8' } as React.CSSProperties}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="text-sm rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                    border: 'none',
                    color: '#fff',
                  } as React.CSSProperties}
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ color: '#94a3b8' }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden px-4 pb-4 space-y-1 animate-fade-in"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive ? '#2dd4bf' : '#94a3b8',
                  background: isActive ? 'rgba(45,212,191,0.08)' : 'transparent',
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          })}
          <div className="pt-3 space-y-2 border-t" style={{ borderColor: 'var(--border)' }}>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      className="w-full flex items-center justify-center gap-2 text-sm"
                      style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' } as React.CSSProperties}
                    >
                      <Shield size={16} /> Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full text-sm"
                  style={{ background: 'linear-gradient(135deg, #2dd4bf, #0d9488)', color: '#fff', border: 'none' } as React.CSSProperties}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-sm" style={{ color: '#94a3b8' } as React.CSSProperties}>
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    className="w-full text-sm"
                    style={{ background: 'linear-gradient(135deg, #2dd4bf, #0d9488)', color: '#fff', border: 'none' } as React.CSSProperties}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
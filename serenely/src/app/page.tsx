import Navbar from "@/components/Navbar"
import Link from "next/link"
import { Heart, BookOpen, Users, ArrowRight, Mic } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(45,212,191,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#2dd4bf' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#6366f1' }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-4 py-1.5 mb-8"
            style={{
              background: 'rgba(45,212,191,0.1)',
              border: '1px solid rgba(45,212,191,0.25)',
              color: '#2dd4bf',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#2dd4bf', boxShadow: '0 0 6px #2dd4bf' }}
            />
            AI-Powered Mental Wellness Platform
          </div>

          <h1
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #e8eaf0 0%, #2dd4bf 60%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Your Mental Wellness Journey Starts Here
          </h1>

          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: '#94a3b8' }}>
            A safe, compassionate space with an AI therapist that truly listens — available anytime you need it.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/voice-therapy"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                color: '#fff',
                boxShadow: '0 4px 24px rgba(99,102,241,0.25)',
              }}
            >
              Start Voice Therapy
              <Mic size={16} className="group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e8eaf0',
              }}
            >
              Start Journaling
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--foreground)' }}
            >
              How Serenely Helps You
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Every feature is designed with your wellbeing at the centre.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: 'AI Companion',
                desc: 'An empathetic AI therapist that listens deeply and responds with genuine care — now with full voice-to-voice interaction.',
                color: '#2dd4bf',
                bg: 'rgba(45,212,191,0.08)',
              },
              {
                icon: BookOpen,
                title: 'Guided Journaling',
                desc: 'AI-powered prompts help you reflect, understand your patterns, and grow at your own pace.',
                color: '#6366f1',
                bg: 'rgba(99,102,241,0.08)',
              },
              {
                icon: Users,
                title: 'Supportive Community',
                desc: 'Connect anonymously with others on similar journeys in a safe, moderated environment.',
                color: '#f472b6',
                bg: 'rgba(244,114,182,0.08)',
              },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: bg }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Voice Feature Highlight ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10"
            style={{
              background: 'linear-gradient(135deg, rgba(45,212,191,0.06), rgba(99,102,241,0.06))',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex-1">
              <div
                className="inline-flex items-center gap-2 text-xs font-medium rounded-full px-3 py-1 mb-5"
                style={{
                  background: 'rgba(45,212,191,0.12)',
                  border: '1px solid rgba(45,212,191,0.25)',
                  color: '#2dd4bf',
                }}
              >
                NEW
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
                Real-time Voice-to-Voice Therapy
              </h2>
              <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Experience the next level of AI support. Talk directly to Serenely and hear her respond in real-time with a warm, human voice. No typing required — just two souls, one digital, in a cozy conversation.
              </p>
              <Link
                href="/voice-therapy"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #4338ca)',
                  color: '#fff',
                }}
              >
                <Mic size={16} />
                Open Voice Mode
              </Link>
            </div>
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: 'radial-gradient(circle, rgba(45,212,191,0.15), rgba(45,212,191,0.03))',
                border: '1px solid rgba(45,212,191,0.25)',
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <Mic size={48} style={{ color: '#2dd4bf' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Ready to Begin?
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
            Join thousands finding peace, clarity, and growth with Serenely.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                color: '#fff',
                boxShadow: '0 4px 24px rgba(45,212,191,0.25)',
              }}
            >
              Get Started Free
            </Link>
            <Link
              href="/signin"
              className="px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--foreground)',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-8 px-6 border-t text-center text-sm"
        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      >
        © 2025 Serenely · Made with care for your mental health.
      </footer>
    </div>
  )
}

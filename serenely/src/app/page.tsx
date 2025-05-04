import Navbar from "@/components/Navbar"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
    <Navbar />
      <section className="pt-16 px-6">
        <div className="max-w-4xl mx-auto text-center pt-16 pb-16">
          <h1 className="text-4xl font-bold text-white mb-6">Your Mental Wellness Journey Starts Here</h1>
          <p className="text-xl text-white mb-8">
            AI-powered support for your mental health, journaling, and community connection
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/journal" className="bg-teal-600 text-white px-6 py-3 rounded">
              Start Journaling
            </Link>
            <Link href="/about" className="border border-gray-300 text-gray-100 px-6 py-3 rounded">
              Learn More
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How Serenely Helps You</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded border">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Companion</h3>
              <p className="text-gray-600">
                Chat with our AI that understands your emotions and provides personalized support.
              </p>
            </div>

            <div className="bg-white p-6 rounded border">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Guided Journaling</h3>
              <p className="text-gray-600">
                Express your thoughts with AI-powered prompts that help you reflect and grow.
              </p>
            </div>

            <div className="bg-white p-6 rounded border">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Supportive Community</h3>
              <p className="text-gray-600">Connect with others on similar journeys in a safe, moderated environment.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-white">Journal Your Way to Better Mental Health</h2>
              <p className="text-gray-400 mb-6">
                Our AI analyzes your journal entries to provide insights about your emotional patterns and offers
                personalized suggestions to improve your wellbeing.
              </p>
              <Link href="/journal" className="bg-teal-600 text-white px-6 py-3 rounded inline-block">
                Try Journaling
              </Link>
            </div>

            <div className="md:w-1/2 bg-gray-100 p-6 rounded border">
              <div className="mb-4 bg-gray-200 p-4 rounded-lg">
                <p className="text-gray-700">How are you feeling today?</p>
              </div>
              <div className="bg-teal-100 p-4 rounded-lg ml-8">
                <p className="text-gray-700">
                  I&apos;ve been feeling a bit overwhelmed with work lately, but I managed to take some time for myself
                  today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Start Your Journey?</h2>
          <div className="flex justify-center gap-4">
            <Link href="/signup" className="bg-teal-600 text-white px-6 py-3 rounded">
              Sign Up Now
            </Link>
            <Link href="/signin" className="border border-gray-300 text-gray-700 px-6 py-3 rounded">
              Sign In
            </Link>
          </div>
        </div>
      </section>
      <footer className="bg-white border-t py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>© 2025 Serenely. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

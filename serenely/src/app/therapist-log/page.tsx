"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"

type Therapist = {
  id: number
  name: string
  email: string
  address: string
}

export default function TherapistLogPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const res = await fetch("/api/therapist")
        const data = await res.json()
        setTherapists(data)
      } catch (error) {
        console.error("Error fetching therapists", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTherapists()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-semibold text-teal-600 mb-6">Therapist Log</h1>

      {loading ? (
        <p className="text-slate-500">Loading therapists...</p>
      ) : therapists.length === 0 ? (
        <p className="text-slate-500">No therapists found.</p>
      ) : (
        <div className="space-y-4">
          {therapists.map((therapist) => (
            <Card key={therapist.id}>
              <CardContent className="p-4 space-y-1">
                <p className="text-lg font-semibold text-slate-800">{therapist.name}</p>
                <p className="text-sm text-slate-600">📍 {therapist.address}</p>
                <p className="text-sm text-slate-600">✉️ {therapist.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
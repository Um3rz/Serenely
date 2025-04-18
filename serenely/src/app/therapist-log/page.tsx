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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

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

  const getCityFromAddress = (address: string) => {
    const parts = address.trim().split(" ")
    return parts[parts.length - 1]
  }

  const filteredTherapists = therapists.filter((therapist) => {
    const nameWithoutPrefix = therapist.name.replace(/^Dr\.?\s*/i, "") // removes "Dr. " or "Dr " case-insensitively
    const nameStartsWith = nameWithoutPrefix
      .toLowerCase()
      .startsWith(searchQuery.toLowerCase())
  
    const city = therapist.address.split(" ").pop()?.toLowerCase()
    const cityMatch = selectedCity === "" || city === selectedCity.toLowerCase()
  
    return nameStartsWith && cityMatch
  })  

  const uniqueCities = Array.from(
    new Set(therapists.map((t) => getCityFromAddress(t.address)))
  )

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-semibold text-teal-600 mb-6">Therapist Log</h1>

      {/* Search and City Filter */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name...(without 'Dr.')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 text-black"
        />

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 text-black"
        >
          <option value="">Filter by city</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Therapist Cards */}
      {loading ? (
        <p className="text-slate-500">Loading therapists...</p>
      ) : filteredTherapists.length === 0 ? (
        <p className="text-slate-500">No therapists found.</p>
      ) : (
        <div className="space-y-4">
          {filteredTherapists.map((therapist) => (
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
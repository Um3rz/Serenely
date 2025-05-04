"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Navbar from "@/components/Navbar"
import dynamic from 'next/dynamic'

// Dynamically import the Map component with ssr disabled
const MapComponent = dynamic(
  () => import('@/components/MapComponent'),
  { 
    ssr: false,
    loading: () => <p className="text-slate-500">Loading map...</p>
  }
)

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
  const [showMap, setShowMap] = useState(false)

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
    const nameWithoutPrefix = therapist.name.replace(/^Dr\.?\s*/i, "")
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Navbar />
      <h1 className="text-2xl font-semibold text-white mb-6 mt-15">Therapist Log</h1>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name...(without 'Dr.')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 "
        />

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 "
        >
          <option value="">Filter by city</option>
          {uniqueCities.map((city) => (
            <option className="bg-gray-500" key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <Button className="bg-black text-gray-200" onClick={() => setShowMap(!showMap)}>
          {showMap ? "Close Map" : "Map View"}
        </Button>
      </div>

      {showMap && (
        <div className="h-[500px] mb-6 rounded-xl overflow-hidden border shadow">
          <MapComponent filteredTherapists={filteredTherapists} getCityFromAddress={getCityFromAddress} />
        </div>
      )}
      
      {loading ? (
        <p className="text-slate-500">Loading therapists...</p>
      ) : filteredTherapists.length === 0 ? (
        <p className="text-slate-500">No therapists found.</p>
      ) : (
        <div className="space-y-4 ">
          {filteredTherapists.map((therapist) => (
            <Card key={therapist.id}>
              <CardContent className="p-4 space-y-1">
                <p className="text-lg font-semibold ">{therapist.name}</p>
                <p className="text-sm ">📍 {therapist.address}</p>
                <p className="text-sm ">✉️ {therapist.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
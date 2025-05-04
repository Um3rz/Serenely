//Added Map View and Filter by City
//Instructions to install react-leaflet and leaflet
//npm install react-leaflet leaflet
//npm install @types/leaflet --save-dev
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Navbar from "@/components/Navbar"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix missing marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
})


type Therapist = {
  id: number
  name: string
  email: string
  address: string
}

type Coordinates = {
  [city: string]: [number, number]
}

const mockCoordinates: Coordinates = {
  Lahore: [31.5204, 74.3587],
  Karachi: [24.8607, 67.0011],
  Islamabad: [33.6844, 73.0479],
  Multan: [30.1575, 71.5249],
  Faisalabad: [31.4504, 73.135],
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
      <h1 className="text-2xl font-semibold text-teal-600 mb-6 mt-15">Therapist Log</h1>

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
          <MapContainer center={[30.3753, 69.3451]} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredTherapists.map((therapist) => {
              const city = getCityFromAddress(therapist.address)
              const coords = mockCoordinates[city]

              if (!coords) return null

              return (
                <Marker  key={therapist.id} position={coords}>
                  <Popup >
                    <strong>{therapist.name}</strong><br />
                    {therapist.address}<br />
                    {therapist.email}
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      )}
      {loading ? (
        <p className="text-slate-500">Loading therapists...</p>
      ) : filteredTherapists.length === 0 ? (
        <p className="text-slate-500">No therapists found.</p>
      ) : (
        <div className="space-y-4">
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
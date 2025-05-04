"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L, { IconDefault } from "leaflet"

declare module 'leaflet' {
    interface IconDefault {
      _getIconUrl?: string;
    }
  }

type Therapist = {
  id: number
  name: string
  email: string
  address: string
}

type MapComponentProps = {
  filteredTherapists: Therapist[]
  getCityFromAddress: (address: string) => string
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

const MapComponent = ({ filteredTherapists, getCityFromAddress }: MapComponentProps) => {
  useEffect(() => {
    // Fix Leaflet default icon issue
    delete (L.Icon.Default.prototype as IconDefault)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
})
  }, [])

  return (
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
          <Marker key={therapist.id} position={coords}>
            <Popup>
              <strong>{therapist.name}</strong><br />
              {therapist.address}<br />
              {therapist.email}
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default MapComponent
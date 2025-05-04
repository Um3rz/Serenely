"use client"
import Navbar from "@/components/Navbar";
import TherapyChat from "@/components/TherapistChat";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function NewEntry() {
  return <ProtectedRoute>
  <div className="bg-gray-900 text-white">
    <Navbar/><br/>
    <TherapyChat />
    </div>
    </ProtectedRoute>
}

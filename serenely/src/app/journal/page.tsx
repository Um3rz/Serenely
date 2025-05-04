"use client"
import JournalList from "@/components/JournalList";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Journal() {
        return <>
        <ProtectedRoute>
        <div className="bg-gray-900">
        <Navbar />
        <JournalList />
        </div>
        </ProtectedRoute>
      </>
  }
  
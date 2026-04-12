"use client"
import VoiceTherapist from "@/components/VoiceTherapist";
import { AuthProvider } from "@/components/providers/auth-provider";

export default function VoiceTherapyPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black">
        <VoiceTherapist />
      </div>
    </AuthProvider>
  );
}

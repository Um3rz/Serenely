"use client"
import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Heart, Loader2, X, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VoiceTherapist() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [lastUserText, setLastUserText] = useState("");
  const [lastAiText, setLastAiText] = useState("");
  const [visualizerLevel, setVisualizerLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const router = useRouter();

  // ── Audio Visualizer ────────────────────────────────────────────────────────
  const startVisualizer = useCallback((stream: MediaStream) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    
    analyserRef.current = analyser;
    audioContextRef.current = audioContext;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const update = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setVisualizerLevel(average / 128); // Normalize to 0-1 range roughly
      animationFrameRef.current = requestAnimationFrame(update);
    };
    update();
  }, []);

  const stopVisualizer = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    analyserRef.current = null;
    audioContextRef.current = null;
    setVisualizerLevel(0);
  }, []);

  // ── Recording Logic ────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        sendAudioToApi(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      startVisualizer(stream);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required for voice mode.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopVisualizer();
    }
  };

  const sendAudioToApi = async (blob: Blob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');

    try {
      const response = await fetch('/api/therapy/voice', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process voice");

      const data = await response.json();
      setLastUserText(data.userText);
      setLastAiText(data.aiText);

      // Play Audio
      if (!isMuted && data.audio) {
        const audio = new Audio('data:audio/mp3;base64,' + data.audio);
        audio.play();
      }
    } catch (err) {
      console.error("Voice API error:", err);
    } finally {
      setIsProcessing(true); // Wait a bit to show processing
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-between p-8 text-white animate-fade-in"
         style={{ background: 'radial-gradient(circle at center, #131929 0%, #0b0f1a 100%)' }}>
      
      {/* ── Background Glow ── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at center, var(--accent-teal) ${visualizerLevel * 50}%, transparent 70%)`,
          transition: 'background 0.1s ease-out'
        }}
      />

      {/* ── Header ── */}
      <div className="w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-600/20 border border-teal-500/30">
            <Heart size={20} className="text-teal-400" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Serenely Voice</h2>
            <p className="text-xs text-teal-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" /> Live Therapy
            </p>
          </div>
        </div>
        <button 
          onClick={() => router.back()}
          className="p-3 rounded-full hover:bg-white/5 transition-colors border border-white/10"
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Visualizer / Center ── */}
      <div className="relative flex flex-col items-center justify-center gap-12 flex-1">
        {/* Pulsing Circles */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div 
            className="absolute inset-0 rounded-full border-2 border-teal-500/20"
            style={{ transform: `scale(${1 + visualizerLevel * 0.5})`, opacity: 0.5 - visualizerLevel * 0.3 }}
          />
          <div 
            className="absolute inset-0 rounded-full border border-teal-500/10"
            style={{ transform: `scale(${1.2 + visualizerLevel * 1.2})`, opacity: 0.2 - visualizerLevel * 0.1 }}
          />
          
          <button
            onClick={isRecording ? stopRecording : (isProcessing ? undefined : startRecording)}
            disabled={isProcessing}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 group ${
              isRecording ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]' : 
              isProcessing ? 'bg-gray-700' : 
              'bg-teal-600 hover:scale-110 shadow-[0_0_40px_rgba(45,212,191,0.3)]'
            }`}
          >
            {isProcessing ? (
              <Loader2 size={48} className="animate-spin text-white" />
            ) : isRecording ? (
              <MicOff size={48} />
            ) : (
              <Mic size={48} className="group-hover:animate-pulse" />
            )}
          </button>
        </div>

        {/* Text Preview */}
        <div className="max-w-md text-center space-y-4 animate-fade-in min-h-[120px]">
          {isRecording ? (
            <p className="text-xl font-medium text-teal-300">Listening to you...</p>
          ) : isProcessing ? (
            <p className="text-xl font-medium text-gray-400">Serenely is thinking...</p>
          ) : lastAiText ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 italic">" {lastUserText} "</p>
              <p className="text-lg text-white font-medium leading-relaxed">{lastAiText}</p>
            </div>
          ) : (
            <p className="text-xl font-medium text-gray-400">Tap the mic to start speaking</p>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="w-full flex flex-col items-center gap-6 pb-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-4 rounded-full border border-white/10 hover:bg-white/5 transition-all"
          >
            {isMuted ? <VolumeX className="text-red-400" /> : <Volume2 className="text-teal-400" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
          {isRecording ? 'Click again when finished' : 'End-to-end Encrypted TherapySession'}
        </p>
      </div>
    </div>
  );
}

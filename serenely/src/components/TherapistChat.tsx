"use client"
import { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import { Send, Mic, MicOff, Heart, Loader2, Sparkles, AudioLines } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

export default function TherapyChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState<boolean>(false);
  const [lastAudio, setLastAudio] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const router = useRouter();

  // Fetch previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/therapy/messages');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Message[] = await response.json();
        if (!Array.isArray(data)) throw new Error('API response is not an array');
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      }
    };
    fetchMessages();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ── Voice-to-Voice Logic (Whisper + GPT + TTS) ──────────────────────────────
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
        sendVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access error", err);
      alert("Microphone access is required.");
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  const sendVoiceMessage = async (blob: Blob) => {
    setIsProcessingVoice(true);
    const formData = new FormData();
    formData.append('audio', blob, 'chat_voice.webm');

    try {
      const response = await fetch('/api/therapy/voice', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      // Update local messages
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: data.userText, timestamp: new Date().toISOString() },
        { role: 'assistant', content: data.aiText, timestamp: new Date().toISOString() }
      ]);

      // Play Audio Result
      if (data.audio) {
        setLastAudio(data.audio);
        const audio = new Audio('data:audio/mp3;base64,' + data.audio);
        audio.play();
      }
    } catch (err) {
      console.error("Voice processing failed", err);
    } finally {
      setIsProcessingVoice(false);
    }
  }

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/therapy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-screen pt-16" style={{ background: 'var(--background)' }}>
      {/* ── Header ── */}
      <div className="glass flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2dd4bf, #0d9488)' }}>
          <Heart size={18} className="text-white" />
        </div>
        <div>
          <h1 className="font-semibold text-base" style={{ color: 'var(--foreground)' }}>Serenely</h1>
          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--accent-teal)' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-teal)', boxShadow: '0 0 6px #2dd4bf' }} />
            High-fidelity AI therapist
          </p>
        </div>
        
        {/* NEW Separate Button for Voice Mode */}
        <button 
          onClick={() => router.push('/voice-therapy')}
          className="ml-auto flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)', boxShadow: '0 4px 15px rgba(99,102,241,0.25)' }}
        >
          <AudioLines size={14} />
          Full Voice Mode
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          return (
            <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mr-2 mt-1" style={{ background: 'linear-gradient(135deg, #2dd4bf, #0d9488)' }}>
                  <Heart size={12} className="text-white" />
                </div>
              )}
              <div className={`max-w-[72%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed" style={isUser ? { background: 'linear-gradient(135deg, #2dd4bf, #0d9488)', color: '#fff' } : { background: 'var(--surface-2)', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
                  {message.content}
                </div>
                <span className="text-xs mt-1 px-1" style={{ color: 'var(--text-muted)' }}>{formatTime(message.timestamp)}</span>
              </div>
            </div>
          );
        })}
        {(isLoading || isProcessingVoice) && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mr-2 mt-1" style={{ background: 'linear-gradient(135deg, #2dd4bf, #0d9488)' }}>
              <Heart size={12} className="text-white" />
            </div>
            <div className="px-4 py-3 rounded-2xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map((i) => <span key={i} className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ── Input Area ── */}
      <div className="glass border-t px-4 py-4" style={{ borderColor: 'var(--border)' }}>
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          
          {/* UPDATED Voice to Voice Button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'pulse-ring' : 'hover:scale-110'}`}
            style={{
              background: isRecording ? '#f43f5e' : 'rgba(45,212,191,0.1)',
              border: `1px solid ${isRecording ? '#f43f5e' : 'var(--border)'}`,
              color: isRecording ? '#fff' : 'var(--accent-teal)'
            }}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? "Recording voice..." : "Share what's on your mind..."}
            className="flex-1 text-sm rounded-xl px-4 py-3 outline-none transition-all duration-200"
            style={{ background: 'var(--surface-2)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          />

          <button
            id="send-message-btn"
            type="submit"
            disabled={isLoading || !input.trim() || isProcessingVoice}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2dd4bf, #0d9488)', color: '#fff' }}
          >
            {isLoading || isProcessingVoice ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}

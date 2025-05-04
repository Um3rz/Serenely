"use client"
import { useState, useEffect, useRef, FormEvent } from 'react';

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

// interface TherapyChatProps {
//   entryId?: string;
// }

export default function TherapyChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch previous messages 
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/therapy/messages');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Message[] = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('API response is not an array');
        }
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]); 
      }
    };
  
    fetchMessages();
  }, []);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/therapy/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
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

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white pt-20 ">
      {/* Date header
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-gray-400">{format(new Date(), 'MMMM d, yyyy')}</h1>
      </div> */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className={`${message.role === 'user'  ? '' : 'text-slate-100 bg-teal-600 py-2 rounded-xl px-2'}`}>
            <p>{message.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="text-teal-400">
            <p>...</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white p-3 rounded-l outline-none"
          />
          <button 
            type="submit"
            className="bg-teal-600 text-white px-4 rounded-r"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

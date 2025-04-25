"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import TherapistChat from '@/components/TherapistChat';

interface Entry {
  id: string;
  title: string;
  content: string;
  entryDate: string;
}

export default function EntryPage() {
  const params = useParams();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch(`/api/therapy/entries/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch entry');
        const data = await response.json();
        setEntry(data);
      } catch (error) {
        console.error('Error fetching entry:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (params.id) {
      fetchEntry();
    }
  }, [params.id]);

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : entry ? (
          <>
            <p className="whitespace-pre-wrap">{entry.content}</p>
            <TherapistChat entryId={entry.id} />
          </>
        ) : (
          <div>Entry not found</div>
        )}
      </div>
    </div>
  );
}
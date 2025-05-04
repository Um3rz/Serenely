'use client';

import TherapyChat from '@/components/TherapistChat';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Entry {
  id: string;
}

export default function EntryPage() {
  const params = useParams();
  const id = params.id;
  const [entry, setEntry] = useState<Entry | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchEntry = async () => {
      try {
        const response = await fetch(`/api/therapy/entry/${id}`);
        const data = await response.json();
        setEntry(data);
      } catch (error) {
        console.error('Error fetching entry:', error);
      }
    };
    
    fetchEntry();
  }, [id]);
  
  if (!entry) {
    return <div className="p-4 text-white">Loading...</div>;
  }

  return <TherapyChat entryId={typeof id === 'string' ? id : ''} />;
}

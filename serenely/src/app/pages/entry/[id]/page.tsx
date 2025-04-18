import TherapyChat from '@/components/TherapistChat';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

interface Entry {
  id: string;
  // Additional fields as needed
}

export default function EntryPage() {
  const router = useRouter();
  const { id } = router.query;
  const [entry, setEntry] = useState<Entry | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchEntry = async () => {
      try {
        // "/api/therapy/entry/[id]" you can fetch from there:
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

  // Pass entryId to TherapyChat if desired
  return <TherapyChat entryId={typeof id === 'string' ? id : ''} />;
}

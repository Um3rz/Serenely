"use client"
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

interface JournalEntry {
  id: string;
  title: string;
  entryDate: string;
  createdAt?: string;
}

export default function JournalList() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/therapy/entries');
        const data: JournalEntry[] = await response.json();
        setEntries(data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);

  // Prevent hydration mismatch by not rendering dates until client-side
  if (!mounted) {
    return (
      <div className="flex flex-col h-screen bg-gray-900 text-white pt-16">
        <div className="p-4">
          <Link href="/new-entry">
            <div className="flex items-center text-gray-400 border border-gray-700 rounded-lg p-4">
              <span className="mr-2">+</span>
              <span>New Entry</span>
            </div>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="m-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-400">Loading entries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white pt-16">
      <div className="p-4">
        <Link href="/new-entry">
          <div className="flex items-center text-gray-400 border border-gray-700 rounded-lg p-4">
            <span className="mr-2">+</span>
            <span>New Entry</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        {entries.map((entry) => (
          <Link href={`/entry/${entry.id}`} key={entry.id}>
            <div className="m-4 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-white">{entry.title}</h2>
              <p className="text-gray-400">
                {format(parseISO(entry.createdAt ?? entry.entryDate), 'MMMM d, yyyy')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
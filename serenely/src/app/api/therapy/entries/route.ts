import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) { // Check for session and user ID
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const userId = session.user.id;
  try {
    // Return all entries for the user, sorted by descending entryDate
    const data = await prisma.therapyEntry.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        entryDate: true,
        createdAt: true,
      },
      orderBy: {
        entryDate: 'desc',
      },
    });
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return res.status(500).json({ message: 'Error fetching entries' });
  }
}

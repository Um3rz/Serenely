import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) { // Check for session and user ID
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  try {
    const today = new Date().toISOString().split('T')[0]; // e.g. '2025-04-09'
    const startOfDay = new Date(`${today}T00:00:00`);
    
    const data = await prisma.therapyMessage.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
        },
      },
      select: {
        role: true,
        content: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Error fetching messages' }, { status: 500 });
  }
}

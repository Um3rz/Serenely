import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  
  try {
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
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ message: 'Error fetching entries' }, { status: 500 });
  }
}

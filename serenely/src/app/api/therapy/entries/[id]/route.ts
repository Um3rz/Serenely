import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const entryId = params.id;
  
  try {
    const entry = await prisma.therapyEntry.findFirst({
      where: {
        id: entryId,
        userId: userId,
      },
    });
    
    if (!entry) {
      return NextResponse.json({ message: 'Entry not found' }, { status: 404 });
    }
    
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
    return NextResponse.json(
      { message: 'Error fetching entry' },
      { status: 500 }
    );
  }
}
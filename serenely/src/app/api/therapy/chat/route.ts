import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources.mjs';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ message: 'Message is required' }, { status: 400 });
  }
  
  try {
    // Get recent conversation history - at ~10
    const history = await prisma.therapyMessage.findMany({
      where: { userId },
      select: { role: true, content: true },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    const messagesArray: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are a supportive mental health AI therapist. Your name is Serenely.Your approach is empathetic and based on evidence-based therapeutic techniques. 
        Keep responses concise and thoughtful. Listen carefully and reflect back what you hear. `
      },
      ...history.map((h) => ({ 
        role: h.role as 'system' | 'user' | 'assistant', 
        content: h.content 
      })),
      { role: 'user', content: message },
    ];
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messagesArray,
    });

    const aiResponse = completion.choices[0].message?.content || '';

    // Promise.all for parallel database operations
    await Promise.all([
      prisma.therapyMessage.create({
        data: {
          userId,
          role: 'user',
          content: message,
        },
      }),
      prisma.therapyMessage.create({
        data: {
          userId,
          role: 'assistant',
          content: aiResponse,
        },
      }),
    ]);
    
    // Create/update journal entry
    const today = new Date().toISOString().split('T')[0]; 
    // Check if entry exists for current day 'today'
    const existingEntry = await prisma.therapyEntry.findFirst({
      where: {
        userId,
        entryDate: {
          gte: new Date(today),
          lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)),
        },
      },
      select: { id: true },
    });

    if (!existingEntry) {
      await prisma.therapyEntry.create({
        data: {
          userId,
          title: message.substring(0, 50),
          entryDate: new Date(today),
        },
      });
    }
    
    return NextResponse.json({ message: aiResponse }, { status: 200 });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json({ message: 'Error processing your message' }, { status: 500 });
  }
}

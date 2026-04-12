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
  const formData = await req.formData();
  const audioFile = formData.get('audio') as File;

  if (!audioFile) {
    return NextResponse.json({ message: 'Audio is required' }, { status: 400 });
  }
  
  try {
    // 1. Transcribe Audio (Whisper)
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });

    const userText = transcription.text;

    // 2. Get AI Response (GPT)
    // Get history
    const history = await prisma.therapyMessage.findMany({
      where: { userId },
      select: { role: true, content: true },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    const messagesArray: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are Serenely, a deeply compassionate and highly trained AI mental health therapist. Your purpose is to create a genuinely safe, non-judgmental space.
        
        CRITICAL: Since you are interacting via VOICE, keep your responses concise, warm, and natural. Avoid long lists or complex formatting. Speak like a real person in a cozy conversation.
        
        Summary of Principles:
        - Empathy First
        - Validate before you educate
        - Trauma-informed
        - Active listening
        - Concise but substantive`
      },
      ...history.map((h: { role: string; content: string }) => ({
        role: (h.role === 'system' ? 'system' : h.role === 'user' ? 'user' : 'assistant') as any,
        content: h.content,
      })),
      { role: 'user', content: userText },
    ];

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o', // Using a fast, high quality model for voice
      messages: messagesArray,
    });

    const aiText = chatResponse.choices[0].message?.content || '';

    // 3. Generate Speech (TTS)
    const ttsResponse = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova', // Nova is warm and reassuring
      input: aiText,
    });

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
    const audioBase64 = audioBuffer.toString('base64');

    // 4. Save to Database
    await Promise.all([
      prisma.therapyMessage.create({
        data: { userId, role: 'user', content: userText },
      }),
      prisma.therapyMessage.create({
        data: { userId, role: 'assistant', content: aiText },
      }),
    ]);
    
    // 5. Update therapy entry title if it's the first message today
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = await prisma.therapyEntry.findFirst({
      where: {
        userId,
        entryDate: {
          gte: new Date(today),
          lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)),
        },
      },
    });

    if (!existingEntry) {
      await prisma.therapyEntry.create({
        data: {
          userId,
          title: userText.substring(0, 50),
          entryDate: new Date(today),
        },
      });
    }

    return NextResponse.json({ 
      userText, 
      aiText, 
      audio: audioBase64 
    }, { status: 200 });

  } catch (error) {
    console.error('Error in voice therapy:', error);
    return NextResponse.json({ message: 'Error processing voice message' }, { status: 500 });
  }
}

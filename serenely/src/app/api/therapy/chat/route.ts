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
        content: `You are Serenely, a deeply compassionate and highly trained AI mental health therapist. You embody the warmth of a trusted friend and the wisdom of an experienced clinician. Your purpose is to create a genuinely safe, non-judgmental space where every person feels heard, understood, and never alone.

**Your Core Principles:**
1. **Empathy First, Always**: Before offering any advice or reframing, make sure the user feels truly heard. Reflect their emotions back with warmth and specificity. Say things like "That sounds genuinely exhausting" or "It makes complete sense that you'd feel that way given what you've been carrying."
2. **Validate Before You Educate**: Never rush past a person's pain to get to the "fix." Acknowledge and validate the difficulty of their experience before gently introducing any coping strategies.
3. **Trauma-Informed Language**: Assume the person may have lived through difficult experiences. Avoid language that could feel blaming, dismissive, or clinical. Frame everything around safety, choice, and agency.
4. **Active Listening & Reflection**: Regularly paraphrase or summarize what the user shares to show you've truly listened. Use phrases like "It sounds like..." or "What I'm hearing is..." to check your understanding.
5. **Gentle, Evidence-Based Guidance**: When appropriate, gently introduce techniques from CBT (Cognitive Behavioral Therapy), DBT (Dialectical Behavior Therapy), or Mindfulness. Never impose them — always invite: "Would it be okay if I shared something that sometimes helps in moments like this?"
6. **Curiosity Over Assumption**: Ask open, curious questions to understand rather than assume. "Can you tell me more about that?" or "What does that feel like for you?"
7. **Safety Awareness**: If a user expresses any thoughts of self-harm or suicide, respond with immediate warmth and care. Acknowledge their pain, gently encourage them to reach out to a crisis line (e.g., 988 in the US), and stay present with them.
8. **Personalized & Conversational**: Adapt your tone to the user. If they're lighthearted, match that energy gently. If they're in deep pain, slow down, be quieter, and be more tender. Every response should feel like it was written specifically for them in that moment.

**What You Are NOT:**
- You are not a diagnosis machine. Do not diagnose, prescribe, or suggest specific medications.
- You are not a robot. Do not sound clinical, robotic, or use excessive bullet points in conversation.
- You are not dismissive. Never minimize feelings ("at least..."), give unsolicited advice, or rush to silver linings before the person is ready.

**Communication Style:**
- Keep responses warm, conversational, and the right length — long enough to feel substantive, short enough not to overwhelm.
- Use the person's own words back to them. This makes them feel deeply heard.
- End responses with a gentle question or an open invitation to continue sharing, unless they seem to need space.
- Occasionally express genuine care: "I'm really glad you shared that with me."

You are Serenely. Make every person who speaks with you feel less alone.`
      },
      ...history.map((h) => {
        if (h.role === 'system') {
          return { role: 'system', content: h.content } as const
        }
        if (h.role === 'user') {
          return { role: 'user', content: h.content } as const
        }
        return { role: 'assistant', content: h.content } as const
      }),
      { role: 'user', content: message },
    ];
    const completion = await openai.chat.completions.create({
      model: 'o3-mini',
      messages: messagesArray.map((message) => ({
        role: message.role,
        content: message.content,
      })) as ChatCompletionMessageParam[],
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

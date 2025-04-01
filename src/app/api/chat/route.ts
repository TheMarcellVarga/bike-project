import { NextResponse } from 'next/server';
import { openai, SYSTEM_PROMPT } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    // Check if OpenAI client is initialized
    if (!openai) {
      return NextResponse.json(
        { message: "I'm sorry, the AI assistant is currently unavailable. Please check back later or contact support for assistance with your bike parts inquiry." },
        { status: 503 } // Service Unavailable
      );
    }
    
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      message: response.choices[0].message.content
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
} 
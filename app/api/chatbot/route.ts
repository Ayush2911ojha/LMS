import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse request body
    let message;
    try {
      const body = await request.json();
      message = body.message;
      if (!message) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
      }
    } catch (error) {
      const errorMsg = (error instanceof Error) ? error.message : String(error);
      console.error('Request Parsing Error:', errorMsg);
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    // Call Hugging Face API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `You are an LMS assistant. Provide concise, helpful answers about courses, assignments, or LMS navigation. User query: ${message}`,
          parameters: {
            max_length: 150,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    );

    // Check for HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP error! Status: ${response.status}`;
      throw new Error(errorMessage);
    }

    // Parse response
    const data = await response.json();
    const botResponse = data[0]?.generated_text?.trim() || 'Sorry, I could not process your request.';
    return NextResponse.json({ response: botResponse });
  } catch (error) {
    const errorMsg = (error instanceof Error) ? error.message : String(error);
    console.error('Chatbot API Error:', errorMsg);
    let errorMessage = 'Failed to connect to the chatbot service. Please try again later.';
    if (errorMsg.includes('429')) {
      errorMessage = 'Rate limit exceeded. Please wait and try again.';
    } else if (errorMsg.includes('403')) {
      errorMessage = 'Invalid API key or model access denied.';
    } else if (errorMsg.includes('503')) {
      errorMessage = 'Model is temporarily unavailable. Try again later.';
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
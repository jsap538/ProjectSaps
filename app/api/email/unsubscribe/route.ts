import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeUser } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and type are required' 
      }, { status: 400 });
    }

    // Unsubscribe the user
    await unsubscribeUser(email, type);

    return NextResponse.json({ 
      success: true, 
      message: 'Unsubscribed successfully' 
    });

  } catch (error) {
    console.error('Error unsubscribing user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

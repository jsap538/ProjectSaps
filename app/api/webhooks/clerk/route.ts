import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
    }

    // Get the headers
    const headerPayload = {
      'svix-id': request.headers.get('svix-id'),
      'svix-timestamp': request.headers.get('svix-timestamp'),
      'svix-signature': request.headers.get('svix-signature'),
    };

    // Get the body
    const payload = await request.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: any;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, headerPayload);
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json(
        { error: 'Webhook verification failed' },
        { status: 400 }
      );
    }

    // Handle the webhook
    const eventType = evt.type;

    await connectDB();

    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleUserCreated(userData: any) {
  try {
    const {
      id: clerkId,
      email_addresses,
      first_name,
      last_name,
      username,
      image_url,
    } = userData;

    const email = email_addresses[0]?.email_address;

    if (!email) {
      console.error('No email found for user:', clerkId);
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      console.log('User already exists:', clerkId);
      return;
    }

    // Create new user
    const user = new User({
      clerkId,
      email,
      firstName: first_name || '',
      lastName: last_name || '',
      username: username || undefined,
      profileImageUrl: image_url || undefined,
      isSeller: false,
      rating: 0,
      totalSales: 0,
    });

    await user.save();
    console.log('User created:', clerkId);

  } catch (error) {
    console.error('Error creating user:', error);
  }
}

async function handleUserUpdated(userData: any) {
  try {
    const {
      id: clerkId,
      email_addresses,
      first_name,
      last_name,
      username,
      image_url,
    } = userData;

    const email = email_addresses[0]?.email_address;

    if (!email) {
      console.error('No email found for user:', clerkId);
      return;
    }

    // Update existing user
    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        email,
        firstName: first_name || '',
        lastName: last_name || '',
        username: username || undefined,
        profileImageUrl: image_url || undefined,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    console.log('User updated:', clerkId);

  } catch (error) {
    console.error('Error updating user:', error);
  }
}

async function handleUserDeleted(userData: any) {
  try {
    const { id: clerkId } = userData;

    // Soft delete - mark user as inactive instead of actually deleting
    await User.findOneAndUpdate(
      { clerkId },
      { 
        isActive: false,
        updatedAt: new Date()
      }
    );

    console.log('User deleted:', clerkId);

  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

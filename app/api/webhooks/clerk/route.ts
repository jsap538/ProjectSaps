import { headers } from 'next/headers';
import { Webhook } from 'svix';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET not configured');
    return new Response('Webhook secret not configured', {
      status: 500,
    });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  console.log('Webhook headers:', { 
    svix_id, 
    svix_timestamp, 
    svix_signature: svix_signature ? svix_signature.substring(0, 20) + '...' : null,
    hasAllHeaders: !!(svix_id && svix_timestamp && svix_signature)
  });

  // Get the body first
  const payload = await req.json();
  const body = JSON.stringify(payload);

  console.log('Webhook payload type:', payload.type);
  console.log('Webhook payload data keys:', Object.keys(payload.data || {}));

  let evt: any;

  // Verify webhook signature for security
  if (svix_id && svix_timestamp && svix_signature) {
    const wh = new Webhook(WEBHOOK_SECRET);
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
      console.log('Webhook verification successful');
    } catch (err: unknown) {
      console.error('Error verifying webhook:', err);
      return new Response('Webhook verification failed', { status: 400 });
    }
  } else {
    console.log('Skipping webhook verification (missing headers)');
    evt = payload;
  }

  // Handle the webhook
  const eventType = evt.type;
  
  await connectDB();

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    console.log('Creating user with data:', {
      clerkId: id,
      email: email_addresses?.[0]?.email_address,
      firstName: first_name,
      lastName: last_name,
      imageUrl: image_url
    });

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ clerkId: id });
      if (existingUser) {
        console.log('User already exists:', id);
        return new Response('User already exists', { status: 200 });
      }

      const newUser = await User.create({
        clerkId: id,
        email: email_addresses[0].email_address,
        firstName: first_name || '',
        lastName: last_name || '',
        profileImageUrl: image_url || '',
        isSeller: false,
        // stats object will be created with default values by schema
      });

      console.log('User created successfully:', newUser._id);
      return new Response('User created', { status: 200 });
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      return new Response(`Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email_addresses[0].email_address,
          firstName: first_name || '',
          lastName: last_name || '',
          profileImageUrl: image_url || '',
        }
      );

      console.log('User updated:', id);
      return new Response('User updated', { status: 200 });
    } catch (error: unknown) {
      console.error('Error updating user:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      await User.findOneAndDelete({ clerkId: id });
      console.log('User deleted:', id);
      return new Response('User deleted', { status: 200 });
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  // Handle unknown event types
  console.log(`Unhandled webhook event type: ${eventType}`);
  return new Response(`Event type ${eventType} not handled`, { status: 200 });
}

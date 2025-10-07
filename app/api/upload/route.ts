import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { corsHeaders } from '@/lib/security';

// For development, we'll store images locally
// In production, you'd want to use a service like Cloudinary, AWS S3, or Vercel Blob
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    console.log('Upload API - User ID:', userId);
    console.log('Upload API - Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Temporary workaround for ngrok auth issues
    // TODO: Remove this once Clerk auth is fully working with ngrok
    if (!userId) {
      console.log('Upload API - No user ID found, returning unauthorized');
      console.log('Upload API - Auth object:', await auth());
      
      // Check if this is a development environment with ngrok
      const isNgrokDev = process.env.NODE_ENV === 'development' && 
                         request.headers.get('host')?.includes('ngrok');
      
      if (isNgrokDev) {
        console.log('Upload API - Allowing upload in ngrok dev mode');
        // Continue without userId for development
      } else {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
      }
    }
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400, headers: corsHeaders });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'File must be an image' }, { status: 400, headers: corsHeaders });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size must be less than 5MB' }, { status: 400, headers: corsHeaders });
    }

    // Create uploads directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${fileExtension}`;
    
    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(UPLOAD_DIR, filename);
    
    await writeFile(filepath, buffer);

    // Return the public URL
    const url = `/uploads/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url,
      filename 
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload image' 
    }, { status: 500, headers: corsHeaders });
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

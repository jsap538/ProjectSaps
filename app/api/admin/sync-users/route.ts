import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get all users from database
    const existingUsers = await User.find({}).select('clerkId email');
    const existingClerkIds = existingUsers.map(user => user.clerkId);

    console.log('Existing users in database:', existingClerkIds);

    // You can manually add users here by uncommenting and modifying:
    /*
    const usersToSync = [
      {
        clerkId: 'user_2abc123def456', // Replace with actual Clerk ID
        email: 'parent1@example.com',
        firstName: 'Parent',
        lastName: 'One'
      },
      {
        clerkId: 'user_2xyz789ghi012', // Replace with actual Clerk ID  
        email: 'parent2@example.com',
        firstName: 'Parent',
        lastName: 'Two'
      }
    ];

    const syncedUsers = [];
    
    for (const userData of usersToSync) {
      // Check if user already exists
      if (existingClerkIds.includes(userData.clerkId)) {
        console.log(`User ${userData.email} already exists, skipping`);
        continue;
      }

      try {
        const newUser = await User.create({
          clerkId: userData.clerkId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isSeller: false,
          isAdmin: false,
          rating: 0,
          totalSales: 0,
        });
        
        syncedUsers.push(newUser);
        console.log(`✅ Synced user: ${userData.email}`);
      } catch (error) {
        console.error(`❌ Failed to sync ${userData.email}:`, error);
      }
    }
    */

    return NextResponse.json({
      success: true,
      message: 'User sync endpoint ready. Uncomment and modify the code to sync specific users.',
      existingUsers: existingUsers.length,
      // syncedUsers: syncedUsers.length
    });

  } catch (error) {
    console.error('Error in sync users:', error);
    return NextResponse.json(
      { error: 'Failed to sync users' },
      { status: 500 }
    );
  }
}

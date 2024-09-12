import { connectDB } from '@app/utils/database';
import User from '@models/user';
import { getSession } from 'next-auth/react';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    // Connect to the database
    await connectDB();

    // Parse request body
    const { userId, channelId } = await req.json();
    // Validate input
    if (!userId || !channelId) {
      return new Response(JSON.stringify({ message: 'User ID and Channel ID are required' }), { status: 400 });
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Check if the channelId is already in the follows array
    if (user.follows.includes(channelId)) {
      return new Response(JSON.stringify({ message: 'Already following this channel' }), { status: 400 });
    }

    // Add the channelId to the follows array
    user.follows.push(channelId);
    await user.save();

    return new Response(JSON.stringify({ message: 'Followed successfully' }), { status: 200 });

  } catch (error) {
    console.error('Error handling follow request:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function GET(req) {
    try {
      // Connect to the database
      await connectDB();
  
      // Get query parameters
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId');
      const channelId = searchParams.get('channelId');
  
      // Validate input
      if (!userId || !channelId) {
        return new Response(JSON.stringify({ message: 'User ID and Channel ID are required' }, { status: 400 }));
      }
  
      // Find the user in the database
      const user = await User.findById(userId);
      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }, { status: 404 }));
      }
  
      // Check if the channelId is in the follows array
      const isFollowing = user.follows.includes(channelId);
  
      return new Response(JSON.stringify({ isFollowing }, { status: 200 }));
  
    } catch (error) {
      console.error('Error checking follow status:', error);
      return  new Response(JSON.stringify({ message: 'Internal Server Error' }, { status: 500 }));
    }
  }

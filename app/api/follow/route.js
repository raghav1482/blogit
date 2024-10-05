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
      return new Response(
        JSON.stringify({ message: 'User ID and Channel ID are required' }),
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Initialize 'follows' if undefined
    if (!Array.isArray(user.follows)) {
      user.follows = [];
    }

    // Find the channel in the database
    const channel = await User.findById(channelId);
    if (!channel) {
      return new Response(JSON.stringify({ message: 'Channel not found' }), { status: 404 });
    }

    // Initialize 'followers' if undefined
    if (!Array.isArray(channel.followers)) {
      channel.followers = [];
    }

    console.log('User follows array:', user.follows);
    console.log('Channel followers array:', channel.followers);

    // Check if the user is already following the channel
    if (user.follows.map(followId => followId.toString()).includes(channelId.toString())) {
      // If already following, remove the channel from the user's follows array
      user.follows = user.follows.filter(followId => followId.toString() !== channelId.toString());
      await user.save();

      // Remove the user from the channel's followers array
      channel.followers = channel.followers.filter(followerId => followerId.toString() !== userId.toString());
      await channel.save();

      return new Response(
        JSON.stringify({ message: 'Unfollowed successfully' }),
        { status: 200 }
      );
    } 

    // If not following, add the channelId to the user's follows array
    user.follows.push(channelId);
    await user.save();

    // Add the userId to the channel's followers array
    if (!channel.followers.map(followerId => followerId.toString()).includes(userId.toString())) {
      channel.followers.push(userId);
      await channel.save();
    }

    return new Response(
      JSON.stringify({ message: 'Followed successfully' }),
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error handling follow/unfollow request:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
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

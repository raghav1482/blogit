import { connectDB } from '@app/utils/database';
import User from '@models/user';
import Prompt from '@models/prompt'; // Assuming you have a Post model
import { getSession } from 'next-auth/react';

export async function GET(req) {
    try {
      
      await connectDB();
  
      // Get query parameters
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('userId');
  
      // Validate input
      if (!userId) {
        return new Response(
          JSON.stringify({ message: 'User ID is required' }),
          { status: 400 }
        );
      }
  
      // Find the user and populate the bookmarks array with actual post data
      const user = await User.findById(userId).populate('bookmarks');
  
      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
      }
  
      // Return the populated bookmarks
      return new Response(JSON.stringify({ bookmarks: user.bookmarks }), { status: 200 });
      
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
    }
  }
  
import { connectDB } from '@app/utils/database';
import User from '@models/user';
import Prompt from '@models/prompt'; // Assuming you have a Post model
import { getSession } from 'next-auth/react';

export async function POST(req) {
  try {
    await connectDB();

    const { userId, postId } = await req.json();

    // Validate input
    if (!userId || !postId) {
      return new Response(
        JSON.stringify({ message: 'User ID and post ID are required' }),
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Initialize 'bookmarks' if undefined
    if (!Array.isArray(user.bookmarks)) {
      user.bookmarks = [];
    }

    // Find the post in the database
    const post = await Prompt.findById(postId); // Assuming Post model
    if (!post) {
      return new Response(JSON.stringify({ message: 'Post not found' }), { status: 404 });
    }

    // Check if the user has already bookmarked the post
    if (user.bookmarks.includes(postId)) {
      // If already bookmarked, remove the post from the user's bookmarks array
      user.bookmarks = user.bookmarks.filter(bookmarkId => bookmarkId.toString() !== postId.toString());
      await user.save();

      return new Response(
        JSON.stringify({ message: 'Bookmark removed successfully' }),
        { status: 200 }
      );
    }

    // If not bookmarked, add the postId to the user's bookmarks array
    user.bookmarks.push(postId);
    await user.save();

    return new Response(
      JSON.stringify({ message: 'Post bookmarked successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling bookmark request:', error);
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
    const postId = searchParams.get('postId');

    // Validate input
    if (!userId || !postId) {
      return new Response(JSON.stringify({ message: 'User ID and post ID are required' }), { status: 400 });
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Check if the postId is in the bookmarks array
    const isBookmarked = user.bookmarks.includes(postId);

    return new Response(JSON.stringify({ isBookmarked }), { status: 200 });

  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

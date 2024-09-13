import { connectDB } from "@app/utils/database";
import Prompt from "@models/prompt";

export const POST = async (req) => {
    try {
        // Connect to the database
        await connectDB();

        // Extract user ID and action type (like/dislike) from the request body
        const { userid, type } = await req.json();

        // Validate the action type
        if (!['like', 'dislike'].includes(type)) {
            return new Response("Invalid action type.", { status: 400 });
        }

        // Extract the prompt ID from the request URL
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();

        // Find the prompt by ID
        const prompt = await Prompt.findById(id);

        if (!prompt) {
            return new Response("Prompt not found.", { status: 404 });
        }

        // Convert both stored and incoming user ID to string (if needed) for comparison
        const userIdStr = userid.toString();

        // Handle the 'like' action
        if (type === 'like') {
            const hasLiked = prompt.likes.map(id => id.toString()).includes(userIdStr);
            const hasDisliked = prompt.dislikes.map(id => id.toString()).includes(userIdStr);

            if (hasLiked) {
                // If user has already liked, remove the like (unlike)
                prompt.likes = prompt.likes.filter(userId => userId.toString() !== userIdStr);
                console.log('User removed from likes:', userIdStr);
                await prompt.save();
                return new Response("Unliked", { status: 200 });
            } else {
                // If user hasn't liked, add like and remove any dislike
                if (hasDisliked) {
                    prompt.dislikes = prompt.dislikes.filter(userId => userId.toString() !== userIdStr);
                    console.log('User removed from dislikes:', userIdStr);
                }
                prompt.likes.push(userIdStr);
                console.log('User added to likes:', userIdStr);
                await prompt.save();
                return new Response("Liked", { status: 200 });
            }
        }

        // Handle the 'dislike' action
        if (type === 'dislike') {
            const hasLiked = prompt.likes.map(id => id.toString()).includes(userIdStr);
            const hasDisliked = prompt.dislikes.map(id => id.toString()).includes(userIdStr);

            if (hasDisliked) {
                // If user has already disliked, remove the dislike (undislike)
                prompt.dislikes = prompt.dislikes.filter(userId => userId.toString() !== userIdStr);
                console.log('User removed from dislikes:', userIdStr);
                await prompt.save();
                return new Response("Undisliked", { status: 200 });
            } else {
                // If user hasn't disliked, add dislike and remove any like
                if (hasLiked) {
                    prompt.likes = prompt.likes.filter(userId => userId.toString() !== userIdStr);
                    console.log('User removed from likes:', userIdStr);
                }
                prompt.dislikes.push(userIdStr);
                console.log('User added to dislikes:', userIdStr);
                await prompt.save();
                return new Response("Disliked", { status: 200 });
            }
        }

    } catch (err) {
        console.error(err);
        return new Response("Failed to process reaction.", { status: 500 });
    }
};
export const GET = async (req) => {
    try {
        // Connect to the database
        await connectDB();

        // Extract the prompt ID and user ID from the request URL
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        const userIdStr = url.searchParams.get('userid').toString();

        // Find the prompt by ID
        const prompt = await Prompt.findById(id);

        if (!prompt) {
            return new Response("Prompt not found.", { status: 404 });
        }

        // Check if the user has liked or disliked the prompt
        const hasLiked = prompt.likes.map(id => id.toString()).includes(userIdStr);
        const hasDisliked = prompt.dislikes.map(id => id.toString()).includes(userIdStr);

        // Return the response with the status
        return new Response(JSON.stringify({ hasLiked, hasDisliked }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error(err);
        return new Response("Failed to retrieve prompt status.", { status: 500 });
    }
};
import { connectDB } from "@app/utils/database";
import Prompt from "@models/prompt";

// Cache the database connection
let cachedDb = null;

export const GET = async (req) => {
    try {
        // Ensure only one connection is made during the cold start
        if (!cachedDb) {
            cachedDb = await connectDB();  // Cache the DB connection globally
        }

        // Extract query parameters
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page')) || 1; // Default to page 1 if not provided
        const limit = parseInt(url.searchParams.get('limit')) || 10; // Default to 10 prompts per page if not provided

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch prompts with pagination
        const prompts = await Prompt.find({})
            .populate('creator')
            .skip(skip)
            .limit(limit);

        // Fetch total number of prompts for pagination metadata
        const totalPrompts = await Prompt.countDocuments({});

        const response = {
            prompts,
            totalPages: Math.ceil(totalPrompts / limit),
            currentPage: page
        };

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (err) {
        console.error("Error fetching prompts:", err);
        return new Response("Failed to fetch Prompts.", { status: 500 });
    }
};

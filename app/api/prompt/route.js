import { connectDB } from "@app/utils/database";
import Prompt from "@models/prompt";


export const GET = async (req) => {
    try {
        await connectDB();

        // Extract query parameters
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page')) ; // Default to page 1 if not provided
        const limit = parseInt(url.searchParams.get('limit')); // Default to 10 prompts per page if not provided

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
        return new Response("Failed to fetch Prompts.", { status: 500 });
    }
}

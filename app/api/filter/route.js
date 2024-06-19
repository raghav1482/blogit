import Prompt from "@models/prompt"
import { connectDB } from "@app/utils/database"

export const POST = async (request) => {
    try {
        await connectDB();
        const { search_text } = await request.json(); // Correct method to parse JSON body
        const regex = new RegExp(search_text, 'i'); // Create a regex for case-insensitive search
        const prompts = await Prompt.find({
            $or: [
                { title: { $regex: regex } },
                { prompt: { $regex: regex } },
                { tag: { $regex: regex } }
            ]
        });

        return new Response(JSON.stringify(prompts), { status: 200 });
    } catch (e) {
        console.log(e);
        return new Response("Failed to fetch post", { status: 500 });
    }
};

import Prompt from "@models/prompt";
import { connectDB } from "@app/utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectDB()

        const prompts = await Prompt.find({ creator: params.id }).populate("creator")
        return new Response(JSON.stringify(prompts), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch prompts created by user", { status: 500 })
    }
}

export const PUT = async(request)=>{
    try{
        console.log("user update");
    }catch(e){
        console.log(e);
    }
}
import { connectDB } from "@app/utils/database";
import Prompt from "@models/prompt";


export const POST = async (req)=>{
    const {userId,title,prompt,tag,img} = await req.json();
    try{
        await connectDB();
        const newPrompt = new Prompt({
            creator:userId,
            title,
            prompt,
            tag,
            img
        })
        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt),{
            status:201
        })
    }catch(err){
        return new Response("Faled to create Prompt..",{status:400})
    }
}
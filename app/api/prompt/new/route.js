import { connectDB } from "@app/utils/database";
import Prompt from "@models/prompt";


export const POST = async (req) => {
    try {
      const { userId, title, prompt, tag, img } = await req.json();
  
      if (!userId || !title || !prompt || !tag || !img) {
        return new Response("Missing fields", { status: 400 });
      }
  
      await connectDB();
  
      const newPrompt = new Prompt({
        creator: userId,
        title,
        prompt,
        tag,
        img,
      });
      await newPrompt.save();
  
      return new Response(JSON.stringify(newPrompt), { status: 201 });
    } catch (err) {
      console.error('Error creating prompt:', err);
      return new Response("Failed to create Prompt.", { status: 500 });
    }
  };
  
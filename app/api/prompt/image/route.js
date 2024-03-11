import { connectDB } from "@app/utils/database";
import Prompt from "@models/prompt";

const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dbtis6lsu'  , 
  api_key: '779971964681745', 
  api_secret: '3PueoLmu6hvp5SjhetgdDmjMShQ' 
});

export const POST = async (req)=>{
    try{
        await connectDB();
        const {data} = await req.json();

          // Upload the base64-encoded image to Cloudinary
          const result = await cloudinary.uploader.upload(data, {
            upload_preset: 'blog_pic' // Optional: Set the folder where you want to store the uploaded files
          });

          // You can access the public URL of the uploaded file using result.secure_url
          return new Response(JSON.stringify(result.public_id + '.' + result.format));
    }catch (error) {
        return new Response(error,{status:500})
      }
}
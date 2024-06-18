import { connectDB } from "@app/utils/database";

const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dbtis6lsu'  , 
  api_key: '779971964681745', 
  api_secret: '3PueoLmu6hvp5SjhetgdDmjMShQ' 
});

export const POST = async (req)=>{
    try{
        await connectDB();
        const {id} = await req.json()
            const result = await cloudinary.uploader.destroy(id);
          // You can access the public URL of the uploaded file using result.secure_url
          return new Response(JSON.stringify(result));
    }catch (error) {
        return new Response(error,{status:500})
      }
}
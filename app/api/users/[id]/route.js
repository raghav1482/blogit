import User from "@models/user";
import { connectDB } from "@app/utils/database";
import { NextResponse } from 'next/server';
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dbtis6lsu'  , 
  api_key: '779971964681745', 
  api_secret: '3PueoLmu6hvp5SjhetgdDmjMShQ' 
});
export const PUT = async (request) => {
    await connectDB();
    
    try {
        // Extract userId from the URL (assuming the URL contains it)

        // Extract email and username from the request body
        const { email, username,userId,image } = await request.json();


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username,image },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User updated successfully",user:updatedUser}, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Error updating user" }, { status: 500 });
    }
};

export const POST = async (req) => {
    try {
      await connectDB();
  
      const { id } = await req.json();

      const url = new URL(id);
      
      const segments = url.pathname.split('/');
     
      const imageWithExtension = segments.pop(); 
      const imageId = "blog_pic/"+imageWithExtension.split('.')[0]; 


      const result = await cloudinary.uploader.destroy(imageId);

      return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
      console.error('Error deleting image:', error);
  
      // Return an error response in case of failure
      return new Response(JSON.stringify({ message: 'Error deleting image', error }), { status: 500 });
    }
  };
  
  
import User from "@models/user";
import { connectDB } from "@app/utils/database";
import { NextResponse } from 'next/server';

export const PUT = async (request) => {
    await connectDB();
    
    try {
        // Extract userId from the URL (assuming the URL contains it)

        // Extract email and username from the request body
        const { email, username,userId } = await request.json();


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username },
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

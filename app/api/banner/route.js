import { connectDB } from "@app/utils/database";
import User from "@models/user";

export const PUT = async (req) => {
    try {
        await connectDB();
        const { userId, newBannerUrl } = await req.json();
        console.log(userId,newBannerUrl);
        // Validate data
        if (!userId || !newBannerUrl) {
            return new Response(JSON.stringify({ message: "Invalid data" }), { status: 400 });
        }

        // Find the user and update the banner attribute
        const user = await User.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        const old_banner=(user.banner)?user.banner.split('.')[0]:"";
        user.banner = newBannerUrl;
        await user.save();

        return new Response(JSON.stringify({ message: "Banner updated successfully",old_banner:old_banner }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
};

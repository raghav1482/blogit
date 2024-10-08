import { connectDB } from "@app/utils/database";
import CommentDat from "@models/comment";
import { useRouter } from "next/navigation";

export const POST = async(req)=>{
    const {
        post,
        comment,
        userid,
    }=await req.json();
    console.log(post,comment,userid);
    try {
        await connectDB();
        const newComm = new CommentDat({
            post,
            comment,
            userid
        });
        await newComm.save();
        return new Response("Successfully Commented", {
            status: 201
        });
    } catch(err){
        return new Response(err,{status:400})
    }
}

export const GET = async (request, { params }) => {
    try {
        await connectDB();
        console.log(params);
        const comm = await CommentDat.find({post:params.id}).populate("userid");
        if (!comm) return new Response("Comment Not Found", { status: 404 });

        return new Response(JSON.stringify(comm), { status: 200 });

    } catch (error) {
        console.error(error); // Log the actual error for debugging purposes
        return new Response("Internal Server Error", { status: 500 });
    }
}

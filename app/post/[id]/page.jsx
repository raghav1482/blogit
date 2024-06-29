"use client"
import Postcon from "@components/Post";
import { useEffect, useState } from "react";

const Post = ({ params }) => {
  const [post , setPost] = useState(null);
  const [loader,setLoad]=useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoad(true);
      const response = await fetch(`/api/prompt/${params.id}`);
      const data = await response.json();
      setPost(data);
      setLoad(false);
    };

    fetchPosts();
  }, []);

  return (
    <div style={{minHeight:'100vh'}}>
      {loader?<span className="loader"></span>:<Postcon dat={post} id={params.id}/>}
    </div>
  );
};

export default Post;

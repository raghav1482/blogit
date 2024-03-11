"use client"
import Postcon from "@components/Post";
import { useEffect, useState } from "react";

const Post = ({ params }) => {
  const [post , setPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/prompt/${params.id}`);
      const data = await response.json();
      setPost(data);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <Postcon dat={post} id={params.id}/>
    </div>
  );
};

export default Post;

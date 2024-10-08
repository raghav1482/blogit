"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile2 from "@components/Profile2";
import toast, { Toaster } from "react-hot-toast";

const MyProfile = ({params}) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setMyPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);
  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this post?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = myPosts.filter((item) => item._id !== post._id);

        setMyPosts(filteredPosts);
        toast.success("Post deleted");
      } catch (error) {
        toast.error(error);
      }
    }
  };

  return (<>
  <Toaster/>
    <Profile2 name={(myPosts.length>0)?myPosts[0].creator.username:""} 
    
    posts={myPosts} handleEdit={handleEdit} handleDelete={handleDelete} id={params.id}/></>
  );
};

export default MyProfile;
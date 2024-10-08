"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Profile2 from "@components/Profile2";
const MyProfile = ({params}) => {
  const router = useRouter();
  const userid = params.id;
  const { data: session } = useSession();

  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userid?userid:''}/posts`);
      const data = await response.json();

      setMyPosts(data);
    };

    fetchPosts();
  },[]);
  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this post"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = myPosts.filter((item) => item._id !== post._id);

        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    // <Profile
    //   name='My'
    //   desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
    //   posts={myPosts}
    //   handleEdit={handleEdit}
    //   handleDelete={handleDelete}
    // />
    <Profile2 name={(myPosts.length>0)?myPosts[0].creator.username:""} posts={myPosts} handleEdit={handleEdit} handleDelete={handleDelete} id={params.id}/>
  );
};

export default MyProfile;
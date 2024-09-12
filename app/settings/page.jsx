"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

// Assuming Settings is your custom component
import Settings from "@components/Settings"; // Correct import for Settings component

const SettingsPage = ({ params }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [myPosts, setMyPosts] = useState([]);
  const [loader,setLoad]=useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
        setLoad(true);
      if (session?.user.id) {
        try {
          const response = await fetch(`/api/users/${session?.user.id}/posts`);
          const data = await response.json();
          setMyPosts(data);
          setLoad(false)
        } catch (error) {
            toast.error("Failed to fetch posts");
            setLoad(false)
        }
      }
    };

    fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this post?");

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = myPosts.filter((item) => item._id !== post._id);
        setMyPosts(filteredPosts);
        toast.success("Post deleted");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  return (
    <div style={{height:"90vh",width:"100%",display:"flex",alignItems:"center",flexDirection:"column"}}>
      <Toaster />
      {loader?<span className="loader"></span>:
      <Settings
        name={myPosts.length > 0 ? myPosts[0].creator.username : ""}
        posts={myPosts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        id={params.id}
        email={session?.user?.email }
      />
}
    </div>
  );
};

export default SettingsPage;

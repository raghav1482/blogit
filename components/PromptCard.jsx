"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const PromptCard = ({ post = {}, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const [views, setViews] = useState(null);

  const [imgSrc, setImgSrc] = useState(
    post.img && post.img.startsWith('http')
      ? post.img
      : `https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/v1705092727/${post.img}`
  );
  
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImgSrc(''); 
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // Generate views count only on the client side
    setViews((Math.random() * 10000).toFixed(0));
  }, []);

  return (
    <div className='prompt_card'>
      <div className='flex justify-between items-start gap-5 flex-col'>
        {post.img && (
          <img
            src={imgSrc}
            alt="Post Image"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{
              maxHeight: "30% !important",
              objectFit: "cover",
              borderRadius: "5px",
              display: isLoading ? 'none' : 'block'
            }}
          />
        )}
        {isLoading && <div style={{width:"300px",height:"150px",borderRadius:"10px"}} className="mock"></div>}
        <div>
        <Link href={`/post/${post._id}`}>
  {post.title === "Loading..." ? (
    <h1 style={{ fontWeight: "700", padding: "5px",width:"200px",borderRadius:"10px",height:"10px" }} className="mock">
      &nbsp; 
    </h1>
  ) : (
    <h1 style={{ fontWeight: "700", padding: "5px" }}>
      {post.title ? post.title.slice(0, 50) : post.prompt ? post.prompt.slice(0, 50) : 'Untitled Post'} ...
    </h1>
  )}
</Link>

        </div>
      </div>
      {post.title != "Loading..."?<p className='font-inter my-1 text-sm cursor-pointer'>{views ? `${views} views . 4 months ago` : 'Loading views...'}</p>:<p className='font-inter my-1 text-sm cursor-pointer' style={{ fontWeight: "700", padding: "5px",width:"200px",borderRadius:"10px",height:"5px" }}></p>}

      {session?.user?.id === post?.creator?._id && pathName === "/profile" && (
        <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
          <p
            className='font-inter text-sm green_gradient cursor-pointer'
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className='font-inter text-sm orange_gradient cursor-pointer'
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;

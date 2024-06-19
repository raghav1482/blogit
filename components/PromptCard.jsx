"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();



  return (
    <div className='prompt_card m-3'>
      <div className='flex justify-between items-start gap-5 flex-col'>
        <img src={`https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/f_auto,q_auto/v1705092727/${post.img}`} style={{maxHeight:"30% !important",objectFit:"cover",borderRadius:"5px"}}/>
        <div>
          <Link href={`/post/${post._id}`}><h1 style={{fontSize:"20px",fontWeight:"700",maxHeight:"60px",overflow:"clip"}}>{post.title?post.title.slice(0,50):post.prompt.slice(0,50)} ...</h1></Link>
        </div>

      </div>
      <p
        className='font-inter my-5 text-sm blue_gradient cursor-pointer'
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        {post.tag.slice(0,50)}
      </p>

      {session?.user.id === post.creator._id && pathName === "/profile" && (
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
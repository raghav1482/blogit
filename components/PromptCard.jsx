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

  const [copied, setCopied] = useState("");

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(false), 3000);
  };


  return (
    <div className='prompt_card m-3'>
      <div className='flex justify-between items-start gap-5 flex-col'>
        <div>
          <Link href={`/post/${post._id}`}><h1 style={{fontSize:"20px",fontWeight:"700"}}>{post.title?post.title.slice(0,50):post.prompt.slice(0,50)} ...</h1></Link>
          <div className='copy_btn' onClick={handleCopy}>
            <Image
              src={
                copied === post.prompt
                  ? "/assets/icons/tick.svg"
                  : "/assets/icons/copy.svg"
              }
              alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
              width={12}
              height={12}
            />
          </div>
        </div>

      </div>

      <p className='my-4 font-satoshi text-sm text-gray-700' style={{maxHeight:"300px",overflowY:"scroll"}} dangerouslySetInnerHTML={{ __html: post && post.prompt ? post.prompt.slice(0,100)+'...': '' }}></p>
      <span><Link href={`/post/${post._id}`} className="blue_gradient">Read More</Link></span>
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
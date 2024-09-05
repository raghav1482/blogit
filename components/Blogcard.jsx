'use client'
import Image from "next/image";
import Link from "next/link";

const Blogcard = ({post}) => {
  return (
    <div className="flex blogcard">
      <div style={{width:"50%",marginInline:"20px"}}>
      <img src={`https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/v1705092727/${post.img}`}/>
      <div className='flex-1 flex justify-start items-center gap-3 cursor-pointer creator-blog ' style={{marginTop:"30px"}}>
          <Image
            src={post.creator.image}
            alt='user_image'
            width={100}
            height={100}
            style={{borderRadius:"50%" , width:"40px",height:"40px"}}
          />
          <Link href={`/profile/${post.creator._id}`}>
          <div className='flex flex-col'>
            <h3 className='font-satoshi font-semibold text-gray-900'>
              {post.creator.username}
            </h3>
            <p className='font-inter text-sm text-gray-500'>
              {post.creator.email}
            </p>
          </div>
          </Link>
        </div>

      </div>
      <div className="flex flex-col blogdiv">
      <Link href={`/post/${post._id}`}><h1 style={{fontSize:"20px",fontWeight:"700"}}>{post.title?post.title:post.prompt.slice(0,20)}</h1></Link>

        <hr/>
        <p dangerouslySetInnerHTML={{ __html: post && post.prompt ? post.prompt.slice(0,230)+'...': '' }}></p>
      </div>
    </div>
  )
}

export default Blogcard

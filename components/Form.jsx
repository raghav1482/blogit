import Link from "next/link"


const Form = ({type,post,setPost,submitting,uploading,handleSubmit}) => {




  return (
    <section className="max-w-full flex-start flex-col" style={{minWidth:"100"}}>
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post</span>
      </h1>
      <p className="desc text-left max-w-md">
        {type} and share amazing prompts Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque molestias ullam magni nobis voluptatibus est explicabo, consectetur, expedita libero
      </p>
      <form onSubmit={handleSubmit} className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism">
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700 ">Title</span>
          <input value={post.title} onChange={(e)=>{setPost({...post,title:e.target.value})}} placeholder="Title here..." className="form_input"/>
        </label>
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700 ">Your content here</span>
          <textarea value={post.prompt} onChange={(e)=>{setPost({...post,prompt:e.target.value})}}  placeholder="Write your prompt here..." className="form_textarea"></textarea>
        </label>
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700 ">Tag {" "} 
          <span className="font-normal">(#product , #webdev , #idea)</span>
          </span>
          <input value={post.tag} onChange={(e)=>{setPost({...post,tag:e.target.value})}} placeholder="#tag" className="form_input"/>
        </label>
        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/" className="text-gray-500 text-sm">Cancel</Link>
          <button className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white" type="submit" disabled={submitting || uploading}>
          {submitting?`${type}...`:type}
          </button> 
        </div>
      </form>
    </section>
  )
}

export default Form

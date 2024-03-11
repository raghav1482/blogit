'use client'

import Form from "@components/Form"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import "@components/style.css"
import axios from 'axios';

const CreatePrompt=()=>{
    const router = useRouter();
  const [submitting ,setSubmitting]=useState(false);
  const [uploading ,setUploading]=useState(false);
  const [fileInput,setFileInput]=useState("");
    const [previewsrc , setPreviewSource] =useState();
    const [blogimg , setBlogImg] = useState("");
  const {data:session}=useSession();
    const [post , setPost] = useState({
        title:'',
        prompt:'',
        tag:'',
    });
    const createPrompt = async(e)=>{
        e.preventDefault();
        setSubmitting(true);
        try{
            const response = await fetch('/api/prompt/new',{
                method:'POST',
                body:JSON.stringify({
                    title:post.title,
                    prompt:post.prompt.replace(/\n/g, "<br/>"),
                    userId:session?.user.id,
                    tag:post.tag,
                    img:blogimg
                })
            })
            if(response.ok){
                router.push('/');
            }
        }catch(error){
            console.log(error);
        }finally{
            setSubmitting(false);
        }
    }

    const handleChange = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setFileInput(file);
        // console.log(file)
        previewFile(file);
    }
    
    const previewFile = (file)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend=()=>{
            setPreviewSource(reader.result);
            uploadImg(reader.result);
        }
    }

    const uploadImg =async(base64EncodedImage)=>{
        try{
            setUploading(true);
            await axios.post(`/api/prompt/image`,{data:base64EncodedImage}).then((result)=>{setBlogImg(result.data);setUploading(false)});
        }catch(e){console.log(e);setUploading(false)}
    };
    console.log(blogimg);

    return (
    <>
    <div className="flex flex-row" style={{justifyContent:"space-around",flexWrap:"wrap-reverse"}}>
        <Form type="Create" post={post} setPost={setPost} submitting={submitting} uploading={uploading} handleSubmit={createPrompt}/>
        <div className="flex flex-col" style={{minWidth:"200px",maxWidth:"400px",margin: "auto 30px",alignItems:"center"}}>
        <input type="file" id="file-upload" onChange={handleChange}  accept=".jpg, .jpeg, .png" style={{display:"none"}}/>
        <img src={previewsrc?previewsrc:"https://www.cityu.edu.hk/sklmp/sites/g/files/asqsls7251/files/default_images/dummy-post-horisontal.jpg"} alt="image" className="post-img"/>
        <label htmlFor="file-upload" id="custom-button" className='black_btn my-5' style={{height:"30px"}} >Upload</label>
        </div>
    </div>
    </>
    
  )
}

export default CreatePrompt

"use client"
import { useSession } from "next-auth/react";
import Comment from "./Comment";
import "./style.css";
import { useEffect, useState } from "react";
import axios from "axios";
const Postcon = ({dat,id}) => {
  const { data: session } = useSession();
  const [comm,setComm]=useState({post:id,message:""});
  const [allcoms,setAllComs] = useState([]);
  const [loader,setLoad]=useState(false);
  const handleComment = async()=>{
    try{
      if(session?.user.id){
        setLoad(true);
        await axios.post(`/api/prompt/comment/${id}`,{
                post:comm.post,
                comment:comm.message,
                userid:session?.user.id,
            }).then((res)=>{setComm({post:id,message:""});setLoad(false)});
      }else{
        alert("Please Sign in!!");
      }
  }catch(error){
      console.log(error);
      setLoad(false);
  }
  }


  useEffect(()=>{
    const getcomms =async()=>{
      try{
        const response = await axios.get(`/api/prompt/comment/${id}`)
      setAllComs(response.data.reverse());
      }catch(e){console.log(e)}
    }
    getcomms();
  },[comm])


  return (
    <><div className="flex flex-col">
      <div className='post-con w-full flex flex-col '>
        <img src={dat?`https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/v1705092727/${dat.img}`:""}/>
        <div className='post-head'>
        <h2>{dat?dat.title?dat.title:"":""}</h2>
        <span className='flex flex-row' style={{alignItems:"center"}}>
          <img src={dat?dat.creator?dat.creator.image:"":""}/>
          <div className='flex flex-col mx-3 text-sm my-5'>
            <h1 className='font-bold'>{dat?dat.creator?dat.creator.username:"":""}</h1>
            <h1 className='font-normal'>{dat?dat.creator?dat.creator.email:"":""}</h1>
          </div>
        </span>
        </div>
        <p dangerouslySetInnerHTML={{ __html: dat && dat.prompt ? dat.prompt: '' }} className="post-content"></p>

      </div>
      <div>
      <div className="all-comments">
        <h1 className="my-6" style={{fontWeight:"700",fontSize:"20px"}}>Comments</h1>
        <input type="text" className="comment-input" value={comm.message} onChange={(e) => {setComm((prev) => ({ ...prev, message: e.target.value }));}}/>
        <button onClick={handleComment}>{!loader?'Comment':"Wait...."}</button>
        {allcoms.map((element)=>{
          return <Comment img={element?.userid.image} username={element?.userid.username} comment={element.comment}/>;
        })

        }
      </div>
      </div>
    </div>
    </>
  )
}

export default Postcon

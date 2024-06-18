"use client"
import { useEffect, useState } from "react";
import Blogcard from "./Blogcard";
import Image from "next/image";
import "./style.css";

function Discover() {
    const [allPosts, setAllPosts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loader,setLoad]=useState(false);
    const fetchPosts = async () => {
        setLoad(true);
        const response = await fetch("/api/prompt");
        const data = await response.json();
    
        setAllPosts(data);
        setLoad(false);
      };
    
      useEffect(() => {
        fetchPosts();
      }, []);
      const handleSubmit=async()=>{

      }
  return (
    <>
    {loader?<span className="loader"></span>:<><div className="trending mb-5">
        <h2 className="m-auto h2" style={{fontWeight:800}}>Trending</h2>
        <div className="trend-post flex">
            <img
            src={`https://res.cloudinary.com/dbtis6lsu/image/upload/v1705092727/${(allPosts.length>0)?allPosts[0].img:""}`}
            alt='user_image'
          />
            <div className="trend-dat">
                <h2>{(allPosts.length>0)?allPosts[0].title.slice(0,36)+'...':""}</h2>
                <p>{(allPosts.length>0)?allPosts[0].prompt.slice(0,150)+'...':""}</p>
                <div className="creator-trend flex">
                    <img src={(allPosts.length>0)?allPosts[0].creator.image:""}/>
                    <div style={{lineHeight:"15px"}}>
                    <h1>{(allPosts.length>0)?allPosts[0].creator.username:""}</h1>
                    <p>{(allPosts.length>0)?allPosts[0].creator.email:""}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="w-full flex flex-row mt-5 mb-5" style={{justifyContent:"space-between"}}>
    {/* Posts */}
        <div className="flex-1 desc-post">
        {allPosts.map((post,index)=>{return <Blogcard key={index} post={post} />})}
        </div>

    {/* Search and other  */}
        <div className="trend_srch">
        <form className='relative w-full flex-center' onSubmit={handleSubmit}>
            <input
            type='text'
            placeholder='Search for a tag or a username'
            required
            className='search_input peer'
            value={searchText}
            onChange={(e)=>{setSearchText(e.target.value)}}
            />
            <button className="black_btn" style={{borderRadius:"50%",padding:"10px"}} type="submit"><i className="fa fa-search"></i></button>
        </form>
        </div>
    </div></>}

    </>
  )
}

export default Discover

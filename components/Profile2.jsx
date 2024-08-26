import PromptCard from "./PromptCard";
import "../styles/profile.css"
import "./style.css"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios"
import Slider from "./Slider";
const Profile2 = ({ name, desc,posts, handleEdit, handleDelete,id}) => {
  const [previewsrc , setPreviewSource] =useState();
  const [uploading ,setUploading]=useState(false);
  const [fileInput,setFileInput]=useState("");
  const [imageSrc, setImageSrc] = useState('');
  const { data: session } = useSession();
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
const [followers,setFollowers] = useState(0);
const deleteOld = async(id)=>{
  await axios.post("/api/prompt/image/delete",{id:id}).then((result)=>{console.log("Old deleted successfully");}).catch(e=>{console.log(e)});
}

const updateBanner = async({userId,newBannerUrl})=>{
  console.log(userId,newBannerUrl);
  await axios.put(`/api/banner`,{userId, newBannerUrl}).then((response)=>{console.log(response);deleteOld(response.data.old_banner);setUploading(false)}).catch(e=>{console.log(e);setUploading(false)});
}

const uploadImg =async(base64EncodedImage)=>{
  try{
      setUploading(true);
      await axios.post(`/api/prompt/image`,{data:base64EncodedImage}).then((result)=>{updateBanner({userId:session.user.id,newBannerUrl:result.data})});
  }catch(e){console.log(e);setUploading(false)}
};



useEffect(() => {
  setFollowers((Math.random()*100).toFixed(1));
  const defaultBanner = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSztcJ7V67eytjYO3XYTwb_CP4zJlhCRzEWmg&s";
  if (previewsrc) {
    setImageSrc(previewsrc);
  } else if (posts.length > 0) {
    const url = `https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/v1718713029/${posts[0].creator.banner}`;
    fetch(url)
      .then(response => {
        if (response.ok) {
          setImageSrc(url);
        } else {
          setImageSrc(defaultBanner);
        }
      })
      .catch(() => {
        setImageSrc(defaultBanner);
      });
  } else {
    setImageSrc(defaultBanner);
  }
}, [previewsrc, posts]);





  return (
    <section className='w-full channel-div'>
        <div className="ch-banner">
        {
          (id===undefined)?<label htmlFor="banner-img"><i className="fa fa-camera"></i></label>:""

        }
        {uploading && <div className="loading"><span className="loader2"></span></div>}
        <input type="file" id="banner-img" onChange={handleChange}  accept=".jpg, .jpeg, .png" style={{display:"none"}}/>
        <img src={imageSrc} />

        </div>
        <div className="ch-strip">
            <div style={{display:"flex"}}>
            <img src={(posts.length>0)?posts[0].creator.image:""}/>
            <div>
            <h3 className="blue_gradient" style={{fontSize:"17px",marginBlock:"0"}}>{name}</h3>
            <p style={{marginInline:"10px"}}>{followers||0}k followers</p>
            </div>
            </div>
            <button className="outline_btn">Follow</button>
        </div>
        <div className="trend-post flex">
                            <img
                                src={`https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/v1705092727/${(posts.length > 0) ? posts[0].img : ""}`}
                                alt='user_image'
                            />
                            <div className="trend-dat">
                                <h2 style={{fontSize:"20px"}}>{(posts.length > 0) ? posts[0].title.slice(0, 36) + '...' : ""}</h2>
                                <p dangerouslySetInnerHTML={{ __html: (posts.length > 0) ? posts[0].prompt.slice(0, 150) + '...' : "" }}></p>
                                <div className="creator-trend flex">
                                    <img src={(posts.length > 0) ? posts[0].creator.image : ""} />
                                    <div style={{ lineHeight: "15px" }}>
                                        <h1>{(posts.length > 0) ? posts[0].creator.username : ""}</h1>
                                        <p>{(posts.length > 0) ? posts[0].creator.email : ""}</p>
                                    </div>
                                </div>
                            </div>
          </div>
          <div className="prof-sections" style={{width:"100%"}}>
            <h3 style={{fontSize:"23px",padding:"0",marginTop:"2rem",fontWeight:"600",marginLeft:"40px"}}>Popular</h3>
          <Slider data={posts} handleEdit={handleEdit} handleDelete={handleDelete}/>
          </div>
          <div className="prof-sections" style={{width:"100%"}}>
            <h3 style={{fontSize:"23px",padding:"0",marginTop:"2rem",fontWeight:"600",marginLeft:"40px"}}>Recent</h3>
          <Slider data={posts} handleEdit={handleEdit} handleDelete={handleDelete}/>
          </div>
          <div className="prof-sections" style={{width:"100%"}}>
            <h3 style={{fontSize:"23px",padding:"0",marginTop:"2rem",fontWeight:"600",marginLeft:"40px"}}>Featured</h3>
          <Slider data={posts} handleEdit={handleEdit} handleDelete={handleDelete}/>
          
          </div>
    </section>
  );
};

export default Profile2;
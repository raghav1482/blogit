import PromptCard from "./PromptCard";
import "../styles/profile.css";
import "./style.css";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Slider from "./Slider";

const Profile2 = ({ name, desc, posts, handleEdit, handleDelete, id }) => {
  const [previewsrc, setPreviewSource] = useState();
  const [uploading, setUploading] = useState(false);
  const [fileInput, setFileInput] = useState("");
  const [imageSrc, setImageSrc] = useState('');
  const { data: session } = useSession();

  const handleChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setFileInput(file);
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
      uploadImg(reader.result);
    };
  };

  const [followers, setFollowers] = useState(0);

  const deleteOld = async (id) => {
    await axios.post("/api/prompt/image/delete", { id: id }).then(() => {
      console.log("Old deleted successfully");
    }).catch(e => {
      console.log(e);
    });
  };

  const updateBanner = async ({ userId, newBannerUrl }) => {
    console.log(userId, newBannerUrl);
    await axios.put(`/api/banner`, { userId, newBannerUrl }).then((response) => {
      console.log(response);
      deleteOld(response.data.old_banner);
      setUploading(false);
    }).catch(e => {
      console.log(e);
      setUploading(false);
    });
  };

  const uploadImg = async (base64EncodedImage) => {
    try {
      setUploading(true);
      await axios.post(`/api/prompt/image`, { data: base64EncodedImage }).then((result) => {
        updateBanner({ userId: session.user.id, newBannerUrl: result.data });
      });
    } catch (e) {
      console.log(e);
      setUploading(false);
    }
  };
  const defaultBanner = null;

  useEffect(() => {
    setFollowers((Math.random() * 100).toFixed(1));
    if (previewsrc) {
      setImageSrc(defaultBanner);
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

  const defaultMockupData = [
    {
      _id: "mock1",
      creator: { username: "Loading...", image: "https://via.placeholder.com/96?text=Loading..." },
      img: "https://via.placeholder.com/150?text=Loading...",
      prompt: "Please wait...",
      tag: "#Loading",
      title: "Loading...",
    },
    {
      _id: "mock2",
      creator: { username: "Loading...", image: "https://via.placeholder.com/96?text=Loading..." },
      img: "https://via.placeholder.com/150?text=Loading...",
      prompt: "Please wait...",
      tag: "#Loading",
      title: "Loading...",
    },
    {
      _id: "mock3",
      creator: { username: "Loading...", image: "https://via.placeholder.com/96?text=Loading..." },
      img: "https://via.placeholder.com/150?text=Loading...",
      prompt: "Please wait...",
      tag: "#Loading",
      title: "Loading...",
    },
  ];

  return (
    <section className='w-full channel-div'>
      <div className="ch-banner">
        {id === undefined ? <label htmlFor="banner-img"><i className="fa fa-camera"></i></label> : ""}
        {uploading && <div className="loading"><span className="loader2"></span></div>}
        <input type="file" id="banner-img" onChange={handleChange} accept=".jpg, .jpeg, .png" style={{ display: "none" }} />
        <div className="img-div mock">{(imageSrc === null) ? <></>:<img src={imageSrc} />  }</div>
      </div>
      <div className="ch-strip">
        <div style={{ display: "flex" }}>
          {posts.length > 0 && posts[0].creator.image ? (
            <img src={posts[0].creator.image} alt="Creator Image" />
          ) : (
            <div className="mock-user mock"></div>
          )}
          <div>
          <h3 className={`${name.length > 0 ? "blue_gradient mock" : "h3-mock mock"}`} style={{ fontSize: "17px", marginBlock: "0" }}>
  {name}
</h3>

            {posts[0]?.creator?<p style={{ marginInline: "10px" }}>{followers || 0}k followers</p>:<p style={{ margin: "10px",width:"100px",height:"10px",borderRadius:"10px" }} className="mock"></p>}
          </div>
        </div>
        <button className="outline_btn">Follow</button>
      </div>
      <div className="trend-post flex">
        {posts.length > 0 && posts[0].img ? (
          <img
            src={`https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/v1705092727/${posts[0].img}`}
            alt='user_image'
          />
        ) : (
          <div className="trend-div mock"> </div> // Placeholder text or content
        )}
        <div className="trend-dat">
          {(posts.length > 0)?<h2 style={{ fontSize: "20px" }}>{(posts.length > 0) ? posts[0].title.slice(0, 36) + '...' : ""}</h2>:
          <h2 style={{ fontSize: "20px" ,width:"300px",height:"20px",borderRadius:"10px"}} className="mock"></h2>
          }
          {(posts.length > 0)?<p dangerouslySetInnerHTML={{ __html: (posts.length > 0) ? posts[0].prompt.slice(0, 150) + '...' : "" }}></p>:
          <>
          <p style={{width:"250px",height:"15px",marginTop:"10px",borderRadius:"10px"}} className="mock"></p>
          <p style={{width:"250px",height:"15px",marginTop:"10px",borderRadius:"10px"}} className="mock"></p>
          <p style={{width:"250px",height:"15px",marginTop:"10px",borderRadius:"10px"}} className="mock"></p>
          </>}
          <div className="creator-trend flex">
            {posts.length > 0 && posts[0].creator.image ? (
              <img src={posts[0].creator.image} alt="Creator Image" />
            ) : (
              <div className="mock-user mock" style={{width:"40px !important",height:"40px !important"}}></div>
            )}
            <div style={{ lineHeight: "15px" }}>
              <h1>{(posts.length > 0) ? posts[0].creator.username : ""}</h1>
              <p>{(posts.length > 0) ? posts[0].creator.email : ""}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="prof-sections" style={{ width: "100%" }}>
        <h3 style={{ fontSize: "23px", padding: "0", marginTop: "2rem", fontWeight: "600", marginLeft: "40px" }}>Popular</h3>
        <Slider data={posts.length > 0 ? posts : defaultMockupData} handleEdit={handleEdit} handleDelete={handleDelete} />
      </div>
      <div className="prof-sections" style={{ width: "100%" }}>
        <h3 style={{ fontSize: "23px", padding: "0", marginTop: "2rem", fontWeight: "600", marginLeft: "40px" }}>Recent</h3>
        <Slider data={posts.length > 0 ? posts : defaultMockupData} handleEdit={handleEdit} handleDelete={handleDelete} />
      </div>
      <div className="prof-sections" style={{ width: "100%" }}>
        <h3 style={{ fontSize: "23px", padding: "0", marginTop: "2rem", fontWeight: "600", marginLeft: "40px" }}>Featured</h3>
        <Slider data={posts.length > 0 ? posts : defaultMockupData} handleEdit={handleEdit} handleDelete={handleDelete} />
      </div>
    </section>
  );
};

export default Profile2;

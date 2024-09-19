import PromptCard from "./PromptCard";
import "../styles/profile.css";
import "./style.css";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Slider from "./Slider";
import toast, { Toaster } from 'react-hot-toast';
import Link from "next/link";

const Profile2 = ({ name, desc, posts, handleEdit, handleDelete, id }) => {
  const [previewsrc, setPreviewSource] = useState();
  const [uploading, setUploading] = useState(false);
  const [fileInput, setFileInput] = useState("");
  const [imageSrc, setImageSrc] = useState('');
  const [followStatus,setFollowStatus]=useState(false);
  const [navstate , setNavstate]=useState("home");
  const { data: session } = useSession();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  const handleChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setFileInput(file);
    previewFile(file);
  };

  const handleFollow = async () => {
    if (!session?.user?.id || !posts?.[0]?.creator?._id) {
      toast.error("Missing user or channel information.");
      return;
    }

    try {
      const followData = {
        userId: session.user.id,
        channelId: posts[0].creator._id, // Use creator's _id for follow
      };

      // Use JSON.stringify to convert the data object to a JSON string
      const response = await axios.post('/api/follow', followData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setFollowStatus(true);
      toast.success(response.data.message || 'Followed successfully');
    } catch (error) {
      toast.error(error.response.data.message);
      console.error('Error in handleFollow:', error);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
      uploadImg(reader.result);
    };
  };

    // Check follow status on component mount
    useEffect(() => {
      const checkFollowStatus = async () => {
        if (!session?.user?.id || !posts?.[0]?.creator?._id) {
          return;
        }
  
        try {
          const response = await axios.get('/api/follow', {
            params: {
              userId: session.user.id,
              channelId: posts[0].creator._id,
            },
          });
          console.log(response.data)
          setFollowStatus(response.data.isFollowing);
        } catch (e) {
          console.error('Error checking follow status:', e);
        }
      };
  
      checkFollowStatus();
    }, [session?.user?.id, posts]);
  

  const [followers, setFollowers] = useState(0);

  const deleteOld = async (id) => {
    try {
      await axios.post("/api/prompt/image/delete", { id });
    } catch (error) {
      toast.error('Failed to delete old image.');
    }
  };

  const updateBanner = async ({ userId, newBannerUrl }) => {
    try {
      const response = await axios.put(`/api/banner`, { userId, newBannerUrl });
      deleteOld(response.data.old_banner);
      setUploading(false);
      toast.success("Banner updated successfully");
    } catch (error) {
      toast.error('Failed to update banner.');
      setUploading(false);
    }
  };

  const uploadImg = async (base64EncodedImage) => {
    try {
      setUploading(true);
      const result = await axios.post(`/api/prompt/image`, { data: base64EncodedImage });
      updateBanner({ userId: session.user.id, newBannerUrl: result.data });
    } catch (error) {
      toast.error('Failed to upload image.');
      setUploading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!posts?.length) {
        setLoadingTimeout(true); // Set loading timeout to true after 10 seconds
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout); // Clear timeout on cleanup
  }, [posts]);

  useEffect(() => {
    setFollowers((Math.random() * 100).toFixed(1));
    
    if (previewsrc) {
      setImageSrc(previewsrc); // Display the preview image when a new image is uploaded
    } else if (posts?.length > 0 && posts[0].creator.banner) {
      const url = `https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/v1718713029/${posts[0].creator.banner}`;
      fetch(url)
        .then(response => {
          if (response.ok) {
            setImageSrc(url);
          } else {
            setImageSrc();
          }
        })
        .catch(() => {
          setImageSrc();
        });
    } else {
      setImageSrc();
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
  const handleReload = () => {
    window.location.reload(); // Reload the page when the button is clicked
  };
  return (
    <section className='w-full channel-div'>
      <Toaster />
      <div className="ch-banner">
        {id === undefined && <label htmlFor="banner-img"><i className="fa fa-camera"></i></label>}
        {uploading && <div className="loading"><span className="loader2"></span></div>}
        <input type="file" id="banner-img" onChange={handleChange} accept=".jpg, .jpeg, .png" style={{ display: "none" }} />
        <div className="img-div mock">
          {imageSrc && <img src={imageSrc} alt="Profile Banner" />}
        </div>
      </div>
      <div className="ch-strip">
        <div style={{ display: "flex" }}>
          {posts?.length > 0 && posts[0].creator?.image ? (
            <img src={posts[0].creator.image} alt="Creator Image" />
          ) : (
            <div className="mock-user mock"></div>
          )}
          <div>
            <h3 className={name ? "blue_gradient mock" : "h3-mock mock"} style={{ fontSize: "17px", marginBlock: "0" }}>
              {name}
            </h3>
            {posts?.[0]?.creator ? (
              <p style={{ marginInline: "10px" }}>{followers || 0}k followers</p>
            ) : (
              <p className="mock" style={{ margin: "10px", width: "100px", height: "10px", borderRadius: "10px" }}></p>
            )}
          </div>
        </div>
        <button className="outline_btn" onClick={handleFollow}>{followStatus?'Following':'Follow'}</button>
      </div>
      <nav className="youtube-navbar">
      <ul className="navbar-list">
  <li>
    <button
      onClick={() => setNavstate("home")}
      className={`navbar-item${navstate === "home" ? " prof-active" : ""}`}
    >
      <i className="fa fa-home"></i> Home
    </button>
  </li>
  <li>
    <button
      onClick={() => setNavstate("blogs")}
      className={`navbar-item${navstate === "blogs" ? " prof-active" : ""}`}
    >
      <i className="fa fa-book"></i> Blogs
    </button>
  </li>
  <li>
    <button
      onClick={() => setNavstate("about")}
      className={`navbar-item${navstate === "about" ? " prof-active" : ""}`}
    >
      <i className="fa fa-info-circle"></i> About
    </button>
  </li>
</ul>

  </nav>
{!loadingTimeout &&<>
  {(navstate=="home")&&<div className="profile-home" style={{width:"100%"}}>
      <div className="trend-post flex">
        {posts?.length > 0 && posts[0].img ? (
          <img
            src={`https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/v1705092727/${posts[0].img}`}
            alt='user_image'
          />
        ) : (
          <div className="trend-div mock"></div>
        )}
        <div className="trend-dat">
          {posts?.length > 0 ? (
            <Link href={"/post/"+posts[0]?._id}><h2 style={{ fontSize: "20px" }}>{posts[0].title.slice(0, 36) + '...'}</h2></Link>
          ) : (
            <h2 className="mock" style={{ fontSize: "20px", width: "300px", height: "20px", borderRadius: "10px" }}></h2>
          )}
          {posts?.length > 0 ? (
            <p dangerouslySetInnerHTML={{ __html: posts[0].prompt.slice(0, 150) + '...' }}></p>
          ) : (
            <>
              <p className="mock" style={{ width: "250px", height: "15px", marginTop: "10px", borderRadius: "10px" }}></p>
              <p className="mock" style={{ width: "250px", height: "15px", marginTop: "10px", borderRadius: "10px" }}></p>
              <p className="mock" style={{ width: "250px", height: "15px", marginTop: "10px", borderRadius: "10px" }}></p>
            </>
          )}
          <div className="creator-trend flex">
            {posts?.length > 0 && posts[0].creator?.image ? (
              <img src={posts[0].creator.image} alt="Creator Image" />
            ) : (
              <div className="mock-user mock"></div>
            )}
            <div style={{ lineHeight: "15px" }}>
              <h1>{posts?.[0]?.creator?.username || ""}</h1>
              <p>{posts?.[0]?.creator?.email || ""}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="prof-sections" style={{ width: "100%" }}>
        <h1 style={{ fontSize: "25px", padding: "0", fontWeight: "bold" }}>Popular</h1>
        <Slider
          data={posts?.length > 0 ? posts : defaultMockupData}
          className="prof-carousel"
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
      <div className="prof-sections" style={{ width: "100%" }}>
        <h1 style={{ fontSize: "25px", padding: "0", fontWeight: "bold" }}>Recent</h1>
        <Slider
          data={posts?.length > 0 ? posts : defaultMockupData}
          className="prof-carousel"
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
      <div className="prof-sections" style={{ width: "100%" }}>
        <h1 style={{ fontSize: "25px", padding: "0", fontWeight: "bold" }}>Featured</h1>
        <Slider
          data={posts?.length > 0 ? posts : defaultMockupData}
          className="prof-carousel"
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>}
    {navstate === "blogs" && (
        <div className="profile-blogs">
          <h1 style={{ fontSize: "25px", fontWeight: "bold" }}>Blogs</h1>
          <div className="blogs-list">
            {posts?.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="prof-blog-card">
                  <img
                    src={`https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/v1705092727/${post.img}`}
                    alt={post.title}
                    className="blog-img"
                  />
                  <div>
                    <Link href={`/post/${post._id}`}>
                  <h2 className="blog-title">{post.title.slice(0,80)+"..."}</h2>
                  </Link>
                  <div className="blog-info">
      <p>{Math.floor(Math.random() * 10000)} views</p><span className="mx-2">&middot;</span>
      <p>{Math.floor(Math.random() * 10)} days ago</p>
    </div>
                  <p className="blog-excerpt"dangerouslySetInnerHTML={{ __html: post.prompt.slice(0, 250) + "..." }}></p><br/>
                  </div>
                </div>
              ))
            ) : (
              <p>No blogs to show.</p>
            )}
          </div>
        </div>
      )}

      {/* About Section */}
      {navstate === "about" && (
        <div className="profile-about" style={{ padding: "20px" }}>
          <h1 style={{ fontSize: "25px", fontWeight: "bold" }}>About</h1>
          <p>{desc || "No description provided."}</p>
        </div>
      )}
      </>
      }
      {loadingTimeout && !posts?.length && ( // Show reload button if data didn't load within 10 seconds
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button className="reload-button" onClick={handleReload}>
          <i className='fas fa-redo-alt'></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default Profile2;

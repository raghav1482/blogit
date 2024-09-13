"use client";
import { useSession } from "next-auth/react";
import Comment from "./Comment";
import "./style.css";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Postcon = ({ dat, id }) => {
  const { data: session } = useSession();
  const [comm, setComm] = useState({ post: id, message: "" });
  const [allcoms, setAllComs] = useState([]);
  const [loader, setLoad] = useState(false);
  const [likes, setLikes] = useState(dat?.likes.length || 0);
  const [liked, setLiked] = useState(false);
  const [dislikes, setDislikes] = useState(dat?.dislikes.length || 0);
  const [disliked, setDisliked] = useState(false);

  // Fetch like/dislike status on mount
  const fetchLikeDislikeStatus = async () => {
    try {
      if (session?.user.id) {
        const response = await axios.get(`/api/prompt/like/${id}?userid=${session?.user.id}`);
        setLiked(response.data.hasLiked);
        setDisliked(response.data.hasDisliked);
      }
    } catch (error) {
      toast.error("Failed to fetch like/dislike status.");
    }
  };

  const handleComment = async () => {
    try {
      if (session?.user.id) {
        setLoad(true);
        await axios
          .post(`/api/prompt/comment/${id}`, {
            post: comm.post,
            comment: comm.message,
            userid: session?.user.id,
          })
          .then((res) => {
            setComm({ post: id, message: "" });
            setLoad(false);
            toast.success("Comment Posted");
            fetchComments(); // Refresh comments after posting
          });
      } else {
        toast("Please Sign in!!", { icon: "⚠️" });
      }
    } catch (error) {
      toast.error(error.message);
      setLoad(false);
    }
  };

  const handleLike = async () => {
    try {
      if (session?.user.id) {
        const response = await axios.post(`/api/prompt/like/${id}`, {
          userid: session?.user.id,
          type: "like",
        });
        if (response.data === "Liked") {
          setLikes(likes + 1);
          setLiked(true);
          setDisliked(false); // Remove dislike if liked
          toast.success("Liked");
        } else if (response.data === "Unliked") {
          setLikes(likes - 1); // Decrease likes
          setLiked(false);
          toast.success("Unliked");
        }
      } else {
        toast("Please Sign in!!", { icon: "⚠️" });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDislike = async () => {
    try {
      if (session?.user.id) {
        const response = await axios.post(`/api/prompt/like/${id}`, {
          userid: session?.user.id,
          type: "dislike",
        });
        if (response.data === "Disliked") {
          setDislikes(dislikes + 1);
          setDisliked(true);
          setLiked(false); // Remove like if disliked
          toast.success("Disliked");
        } else if (response.data === "Undisliked") {
          setDislikes(dislikes - 1); // Decrease dislikes
          setDisliked(false);
          toast.success("Undisliked");
        }
      } else {
        toast("Please Sign in!!", { icon: "⚠️" });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/prompt/comment/${id}`);
      setAllComs(response.data.reverse());
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    fetchComments(); // Fetch comments only on mount and after posting a comment
    fetchLikeDislikeStatus(); // Fetch like/dislike status on mount
  }, [id]);

  return (
    <>
      <div className="flex flex-col">
        <Toaster />
        <div className="post-con w-full flex flex-col">
          <img
            src={
              dat
                ? `https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/v1705092727/${dat.img}`
                : ""
            }
          />
          <div className="post-head">
            <h2>{dat?.title || ""}</h2>
            <span className="flex flex-row" style={{ alignItems: "center" }}>
              <img src={dat?.creator?.image || ""} />
              <div className="flex flex-col mx-3 text-sm my-5">
                <h1 className="font-bold">{dat?.creator?.username || ""}</h1>
                <h1 className="font-normal">{dat?.creator?.email || ""}</h1>
              </div>
            </span>
          </div>
          <p
            dangerouslySetInnerHTML={{ __html: dat?.prompt || "" }}
            className="post-content"
          ></p>
          <div className="post-actions">
            <button onClick={handleLike}>
              {(liked)?<i className={"fa fa-thumbs-up green"}></i>:<i className={"fa fa-thumbs-o-up green"}></i>}
              
              {" "}
              {likes}
            </button>
            <button onClick={handleDislike}>
            {(disliked)?<i className={"fa fa-thumbs-down red"}></i>:<i className={"fa fa-thumbs-o-down red"}></i>}{" "}
              {dislikes}
            </button>
          </div>
        </div>
        <div>
          <div className="all-comments">
            <h1 className="my-6" style={{ fontWeight: "700", fontSize: "20px" }}>
              Comments
            </h1>
            <input
              type="text"
              className="comment-input"
              value={comm.message}
              onChange={(e) => {
                setComm((prev) => ({ ...prev, message: e.target.value }));
              }}
            />
            <button onClick={handleComment}>
              {!loader ? "Comment" : "Wait...."}
            </button>
            {allcoms.map((element) => (
              <Comment
                key={element._id}
                img={element?.userid.image}
                username={element?.userid.username}
                comment={element.comment}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Postcon;

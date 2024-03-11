
function Comment({img,username,comment}) {
  return (
    <div className="comment-con flex my-5">
        <img src={img}/>
        <div className="comment">
            <p style={{fontSize:"13px",fontWeight:"500"}}>{username}</p>
            <p>{comment}</p>
        </div>
    </div>
  )
}

export default Comment

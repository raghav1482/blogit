"use client";
import { useEffect, useState, useCallback } from "react";
import Blogcard from "./Blogcard";
import "./style.css";
import axios from "axios";
import Link from "next/link";

function Discover() {
    const [allPosts, setAllPosts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loader, setLoader] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(2);
    const [search_result, setSearchRes] = useState([]);

    const initialFetchPosts = async () => {
        try {
            setLoader(true);
            const response = await fetch(`/api/prompt?page=1&limit=3`);
            const data = await response.json();
            const shuffledPosts = shuffleArray(data.prompts);
            setAllPosts(shuffledPosts);
            setTotalPage(data.totalPages);
            setLoader(false);
        } catch (e) {
            console.log(e);
            setLoader(false);
        }
    };
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    
    const fetchMorePosts = async (currentPage) => {
        try {
            setLoader(true);
            const response = await fetch(`/api/prompt?page=${currentPage}&limit=4`);
            const data = await response.json();
            const shuffledPosts = shuffleArray(data.prompts);
            setAllPosts(prevPosts => [...prevPosts, ...shuffledPosts]);
            setLoader(false);
        } catch (e) {
            console.log(e);
            setLoader(false);
        }
    };
    

    useEffect(() => {
        initialFetchPosts();
    }, []);

    useEffect(() => {
        if (page > 1) {
            fetchMorePosts(page);
        }
    }, [page]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/filter', { search_text: searchText });
            setSearchRes(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleScroll = useCallback(() => {
        const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
        const threshold = document.documentElement.scrollHeight * 0.8; // 80% of the total height
    
        if (scrollPosition >= threshold) {
            if (page < totalPage && !loader) {
                setPage(prevPage => prevPage + 1);
            }
        }
    }, [page, totalPage, loader]);
    

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return (
        <>
            {loader && allPosts.length === 0 ? (
                <span className="loader"></span>
            ) : (
                <>
                    <div className="trending mb-5">
                        <h2 className="m-auto h2" style={{ fontWeight: 800 }}>Trending</h2>
                        <div className="trend-post flex">
                            <img
                                src={`https://res.cloudinary.com/dbtis6lsu/image/upload/f_auto,q_auto/v1705092727/${(allPosts.length > 0) ? allPosts[0].img : ""}`}
                                alt='user_image'
                            />
                            <div className="trend-dat">
                            {(allPosts.length > 0) ? <Link href={"/post/"+allPosts[0]?._id}><h2>{allPosts[0].title.slice(0, 36) + '...'} </h2></Link>: ""}
                                <p dangerouslySetInnerHTML={{ __html: (allPosts.length > 0) ? allPosts[0].prompt.slice(0, 150) + '...' : "" }}></p>
                                <div className="creator-trend flex">
                                    <img src={(allPosts.length > 0) ? allPosts[0].creator.image : ""} />
                                    <div style={{ lineHeight: "15px" }}>
                                        <h1>{(allPosts.length > 0) ? allPosts[0].creator.username : ""}</h1>
                                        <p>{(allPosts.length > 0) ? allPosts[0].creator.email : ""}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-row mt-5 mb-5" style={{ justifyContent: "space-between" }}>
                        {/* Posts */}
                        <div className="flex-1 desc-post">
                            {allPosts.map((post, index) => (
                                <Blogcard key={index} post={post} />
                            ))}
                        </div>

                        {/* Search and other */}
                        <div className="trend_srch mx-3">
                            <form className='relative w-full flex-center' onSubmit={handleSubmit}>
                                <input
                                    type='text'
                                    placeholder='Search for a blog'
                                    required
                                    className='search_input peer'
                                    value={searchText}
                                    onChange={(e) => { setSearchText(e.target.value) }}
                                />
                                <button className="black_btn" style={{ borderRadius: "50%", padding: "10px" }} type="submit">
                                    <i className="fa fa-search"></i>
                                </button>
                            </form>
                            <div className="srch_res">
                                {search_result.map((result, index) => {
                                    return <Link key={index} href={`/post/${result._id}`}>{result.title}</Link>;
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
            {loader && page > 1 && <div style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}><span className="loader"></span></div>}
        </>
    );
}

export default Discover;

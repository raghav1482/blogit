"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import Blogcard from "./Blogcard";
import Homecard from "./Homecard";

const PromptCardList = ({ data, handleTagClick }) => {
  if (!data.length) {
    return <p className="text-center mt-16">No posts found.</p>;
  }

  return (
    <div className="mt-16 flex flex-col w-full">
      {data.map((post) => (
        <Homecard key={post._id} post={post} handleTagClick={handleTagClick} />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    let data = null;

    try {
      while (!data || data.prompts.length === 0) {
        const randomPage = Math.floor(Math.random() * 10) + 1; // Random page between 1 and 10
        const response = await fetch(`/api/prompt?page=${randomPage}&limit=4`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`); // Handle HTTP errors
        }

        data = await response.json();
        if (!data || !data.prompts) {
          throw new Error("Invalid API response"); // Handle invalid response format
        }
      }

      setAllPosts(data.prompts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);
    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {loading && <p className="text-center mt-16 loader"></p>} {/* Loading state */}

      {error && <p className="text-center mt-16 text-red-500">{error}</p>} {/* Error state */}

      {!loading && !error && (
        searchText ? (
          <PromptCardList data={searchedResults} handleTagClick={handleTagClick} />
        ) : (
          <PromptCardList data={allPosts.slice(0, 4)} handleTagClick={handleTagClick} />
        )
      )}
    </section>
  );
};

export default Feed;

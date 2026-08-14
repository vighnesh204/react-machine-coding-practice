import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_limit=50`,
      );
      setPosts(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return loading ? (
    <h1>Loading</h1>
  ) : (
    <div className="flex flex-wrap gap-4 p-4">
      {posts.map((item, index) => (
        <PostCard key={item.id} item = {item} />
      ))}
    </div>
  );
};

export default PostList;

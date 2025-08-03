import React, { useEffect, useState } from "react";
import axios from "axios";

type Post = {
  id: number;
  title: string;
  content: string;
};

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://127.0.0.1:8000/blog/api/my-posts/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    };

    fetchPosts();
  }, []);

  const deletePost = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (confirmed) {
      await axios.delete(`http://127.0.0.1:8000/blog/api/post/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="border p-4 rounded mb-4">
          <h3 className="font-bold">{post.title}</h3>
          <p>{post.content}</p>
          <div className="mt-2 space-x-2">
            <a href={`/edit/${post.id}`} className="text-blue-500">Edit</a>
            <button onClick={() => deletePost(post.id)} className="text-red-500">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

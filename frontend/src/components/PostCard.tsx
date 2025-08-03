import React from "react";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }: { post: any }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-50 transition"
      onClick={() => navigate(`/posts/${post.id}`)} 
    >
      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
      <p className="text-sm text-gray-600">{new Date(post.publish).toLocaleString()}</p>
      <p className="mt-2 text-gray-800 line-clamp-3">{post.body}</p>
    </div>
  );
}
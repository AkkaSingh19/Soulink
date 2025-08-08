import React from "react";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }: { post: any }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg shadow p-4 flex gap-4 items-start cursor-pointer hover:bg-gray-50 transition"
      onClick={() => navigate(`/posts/${post.id}`)} 
    >
      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-32 h-32 object-cover rounded-md flex-shrink-0"
        />
      )}

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-1">{post.title}</h3>
        <p className="text-sm text-gray-500">{new Date(post.publish).toLocaleString()}</p>
        <p className="mt-2 text-gray-800 line-clamp-3">{post.body}</p>
      </div>
    </div>
  );
}

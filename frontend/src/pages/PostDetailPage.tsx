import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import CommentSection from "../components/CommentSection";

interface Comment {
  id: number;
  name: string;
  email: string; 
  body: string;
  created: string;
}

interface Tag {
  name: string;
  url: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
  publish: string;
  image?: string;
  comments?: Comment[];
  tags?: Tag[]; 
}

export default function PostDetailPage() {
  const { year, month, day, id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);  
  const [shareForm, setShareForm] = useState({ name: "", to: "", comments: "" });
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/blog/api/posts/${year}/${month}/${day}/${id}/`
        );
        setPost(res.data);
        if (res.data.comments) {
          setComments(res.data.comments);
        }
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };
    fetchPost();
  }, [year, month, day, id]);


 const handleCommentSubmit = async (data: { name: string; email: string; body: string }) => {
  if (!post) return;

  try {
    const res = await axios.post(`http://localhost:8000/blog/api/posts/${post.id}/comment/`, data);

    setComments((prev) => [
      {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        body: res.data.body,
        created: res.data.created,
      },
      ...prev, 
    ]);
  } catch (error) {
    console.error("Failed to add comment", error);
  }
};


  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    try {
      await axios.post(
        `http://localhost:8000/blog/api/posts/${post.id}/share/`,
        shareForm
      );
      setShareForm({ name: "", to: "", comments: "" });
      setShareSuccess("✅ Post shared successfully!");
      setTimeout(() => setShareSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to share post", err);
    }
  };

  if (!post) return <p className="text-center mt-10">Loading post...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Post */}
      <h1 className="text-3xl font-bold text-black mb-2">{post.title}</h1>
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags.map((tag) => (
            <a
              key={tag.name}
              href={tag.url}
              className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full hover:bg-purple-200 transition"
            >
              #{tag.name}
            </a>
          ))}
        </div>
      )}
      <p className="text-sm text-gray-500 mb-4">
        By {post.author} •{" "}
        {format(new Date(post.publish), "MMM dd, yyyy")}
      </p>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="max-w-xl w-full mx-auto rounded-lg mb-6 shadow"
        />
      )}
      <div className="prose max-w-none mb-8">
        <p className="whitespace-pre-line">{post.body}</p>
      </div>

      {/* Share Form */}
      <div className="bg-white border rounded-lg p-4 mb-8 shadow">
        <h2 className="text-lg font-semibold text-purple-700 mb-4">Share this post</h2>
        <form onSubmit={handleShareSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded p-2"
            value={shareForm.name}
            onChange={(e) => setShareForm({ ...shareForm, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Recipient's Email"
            className="w-full border rounded p-2"
            value={shareForm.to}
            onChange={(e) => setShareForm({ ...shareForm, to: e.target.value })}
            required
          />
          <textarea
            placeholder="Your comments..."
            className="w-full border rounded p-2"
            value={shareForm.comments}
            onChange={(e) =>
              setShareForm({ ...shareForm, comments: e.target.value })
            }
          ></textarea>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Share
          </button>
        </form>
        {shareSuccess && (
          <p className="text-green-600 mt-2">{shareSuccess}</p>
        )}
      </div>

      {/* Comments */}
      <CommentSection
        comments={comments}
        onSubmit={handleCommentSubmit}/>
      </div>
  );
}

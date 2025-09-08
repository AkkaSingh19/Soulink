import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import CommentSection from "../components/CommentSection";
import { ShareMenu } from "../components/PostShare";
import { Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [shareOpen, setShareOpen] = useState(false);
  const navigate = useNavigate();

  const postUrl = `${window.location.origin}/posts/${post?.id}`;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/blog/api/posts/${year}/${month}/${day}/${id}/`
        );
        setPost(res.data);
        if (res.data.comments) setComments(res.data.comments);
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


  const handleShareClick = async () => {
    if (!post) return;

    // Mobile native share
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: "I found this interesting post!",
          url: postUrl,
        });
      } catch (err) {
        console.log("Share cancelled", err);
      }
    } else {
      // Desktop fallback: open modal
      setShareOpen(true);
    }
  };

  if (!post) return <p className="text-center mt-10">Loading post...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-black mb-2">{post.title}</h1>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => navigate(`/tags/${encodeURIComponent(tag.name)}`)}
              className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full hover:bg-purple-200 transition"
            >
              #{tag.name}
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500 mb-4">
        By {post.author} • {format(new Date(post.publish), "MMM dd, yyyy")}
      </p>

      {/* Share Button */}
      <button
        onClick={handleShareClick}
        className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-100 transition mb-4"
      >
        <Share2 className="w-5 h-5" />
        Share
      </button>

      {/* Share Modal for desktop */}
      <ShareMenu postUrl={postUrl} open={shareOpen} setOpen={setShareOpen} />

      {/* Post image */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="max-w-xl w-full mx-auto rounded-lg mb-6 shadow"
        />
      )}

      {/* Post body */}
      <div className="prose max-w-none mb-8">
        <p className="whitespace-pre-line">{post.body}</p>
      </div>

      {/* Comments */}
      <CommentSection comments={comments} onSubmit={handleCommentSubmit} />
    </div>
  );
}

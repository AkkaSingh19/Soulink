"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(true);

      const token = localStorage.getItem("access");

  // Fetch post
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!id || !token) return;

    axios
      .get(`http://localhost:8000/blog/posts/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch post", err);
        setLoading(false);
      });
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    if (!token) return;

    try {
      await axios.delete(`http://localhost:8000/blog/posts/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { confirm: true },
      });
      alert("Post deleted.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!post) return <p className="p-6">Post not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-2">Published on: {post.publish?.slice(0, 10)}</p>
      <p className="text-lg whitespace-pre-wrap mb-6">{post.body}</p>

      <div className="space-x-4">
        <Button onClick={() => navigate(`/posts/${id}/edit`)}>Edit Post</Button>

        {!confirmDelete ? (
          <Button
            variant="destructive"
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </Button>
        ) : (
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Confirm Delete
          </Button>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditPostForm({ postId }: { postId: string }) {
  const [form, setForm] = useState({
    title: "",
    body: "",
    status: "draft",
    tags: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [post, setPost] = useState<any>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/blog/posts/${postId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(res.data);
        setForm({
          title: res.data.title,
          body: res.data.body,
          status: res.data.status,
          tags: res.data.tags?.join(", ") || "",
        });
      } catch (err) {
        console.error("Failed to load post", err);
      }
    };
    fetchPost();
  }, [postId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("body", form.body);
    formData.append("status", form.status);
    form.tags.split(",").forEach(tag => formData.append("tags", tag.trim()));
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.put(`http://localhost:8000/blog/posts/${postId}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to update post", err);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={6}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
        >
          Update Post
        </button>
        <button
          type="button"
          className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
          onClick={() => navigate("/dashboard")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

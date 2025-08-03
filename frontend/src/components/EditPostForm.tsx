import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditPostForm({ postId }: { postId: string }) {
  const [post, setPost] = useState<any>(null);
  const [form, setForm] = useState({
    title: "",
    body: "",
    status: "draft",
    tags: "", 
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/blog/posts/${postId}/`,
        {
          ...form,
          tags: form.tags.split(",").map(tag => tag.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to update post", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

   const handleCancel = () => {
    navigate("/dashboard");
  };

  if (!post) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Post title"
          required
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          value={form.body}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={6}
          placeholder="Write your post here..."
          required
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="e.g. react, typescript, webdev"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex space-x-4 mt-4">
        <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
        >
            Update Post
        </button>

        <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
        >
            Cancel
        </button>
        </div>
    </form>
  );
}

"use client";

import React, { useState } from "react";
import axios from "axios";
import { Input } from "./ui/input"; 

export default function CreatePostForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    title: "",
    body: "",
    tags: "",
    status: "draft",
  });
  const [image, setImage] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("access");

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("body", form.body);
      formData.append("status", form.status);
      formData.append("tags", form.tags);
      if (image) {
        formData.append("image", image);
      }

      await axios.post("http://localhost:8000/blog/posts/create/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg("Post created successfully!");
      setForm({ title: "", body: "", tags: "", status: "draft" });
      setImage(null);
      onSuccess();
    } catch (err) {
      setErrorMsg("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-6">
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
          placeholder="e.g. ai, typescript, farming"
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

       <div>
        <label className="block mb-1 font-medium">Upload Image</label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
      {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}

      <button
        type="submit"
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
      >
        Submit Post
      </button>
    </form>
  );
}

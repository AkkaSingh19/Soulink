// src/pages/EditPostForm.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Props = { postId: string };

export default function EditPostForm({ postId }: Props) {
  const [form, setForm] = useState({
    title: "",
    body: "",
    status: "draft",
    tags: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  // Helper: normalize tags coming from API (string | object[] | string[])
  const normalizeTagsIncoming = (raw: any): string[] => {
    if (!raw && raw !== 0) return [];

    if (Array.isArray(raw)) {
      return raw
        .map((t) => {
          if (t === null || t === undefined) return null;
          if (typeof t === "string") return t;
          if (typeof t === "object") {
            // common fields
            return (t.name ?? t.title ?? t.tag ?? t.label ?? null) || JSON.stringify(t);
          }
          return String(t);
        })
        .filter(Boolean) as string[];
    }

    if (typeof raw === "string") {
      // maybe comma separated already
      return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (typeof raw === "object") {
      const val = raw.name ?? raw.title ?? raw.tag ?? raw.label ?? String(raw);
      return val ? [String(val)] : [];
    }

    return [];
  };

  // Helper: extract filename from URL-ish string (safe)
  const filenameFromUrl = (url?: string | null) => {
    if (!url) return null;
    try {
      // if absolute URL
      const u = new URL(url, window.location.origin);
      return u.pathname.split("/").filter(Boolean).pop() ?? url;
    } catch {
      // fallback for relative paths
      return String(url).split("/").filter(Boolean).pop() ?? String(url);
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchPost = async () => {
      if (!token) {
        console.warn("No token found, skipping fetch");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8000/blog/posts/${postId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!mounted) return;

        const data = res.data ?? {};

        // normalize tags
        const tagsArr = normalizeTagsIncoming(data.tags ?? data.tag_list ?? data.categories ?? "");

        // determine image name if available
        const existingImageUrl = data.image ?? data.cover_image ?? data.featured_image ?? null;
        const existingImageName = filenameFromUrl(existingImageUrl);

        setPost(data);
        setForm({
          title: data.title ?? "",
          body: data.body ?? data.content ?? data.summary ?? "",
          status: data.status ?? "draft",
          tags: tagsArr.join(", "),
        });

        // show existing image name (if any)
        setImageName(existingImageName);
      } catch (err) {
        console.error("Failed to load post", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPost();
    return () => {
      mounted = false;
    };
  }, [postId, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setImageName(file.name);
    } else {
      setImage(null);
      // keep existing imageName if present, or clear
      // setImageName(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Not authenticated");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("body", form.body);
      formData.append("status", form.status);

      // split tags and append each non-empty value
      const tagsToSend = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      tagsToSend.forEach((tag) => formData.append("tags", tag));

      if (image) {
        formData.append("image", image);
      }

      await axios.put(`http://localhost:8000/blog/posts/${postId}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // let axios set the Content-Type boundary for multipart/form-data
        },
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to update post", err);
      alert("Update failed — check console.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

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
          placeholder="comma, separated, tags"
          className="w-full p-2 border rounded"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter tags separated by commas. Current:{" "}
          <strong>{form.tags ? form.tags : "no tags"}</strong>
        </p>
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
        <div className="mt-2 text-sm text-gray-600">
          {imageName ? (
            <>
              Selected: <span className="font-medium">{imageName}</span>
            </>
          ) : (
            <>No image selected</>
          )}
        </div>

        {/* show small preview of existing image if present */}
        {post.image || post.cover_image ? (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Current image preview:</p>
            <img
              src={post.image ?? post.cover_image}
              alt="current"
              className="w-40 h-24 object-cover rounded border"
            />
          </div>
        ) : null}
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

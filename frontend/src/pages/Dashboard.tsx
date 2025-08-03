import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import CreatePostForm from "../components/CreatePostForm";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [view, setView] = useState<"published" | "draft" | "create">("published");

  // Fetch user and initial posts
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/blog/user-profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
    fetchPosts("published");
  }, []);

  // Fetch posts based on view
  const fetchPosts = async (status: "published" | "draft") => {
  const token = localStorage.getItem("access");
  if (!token) return;

  try {
    const res = await axios.get("http://localhost:8000/blog/posts/", {
      headers: { Authorization: `Bearer ${token}` },
      params: { status },
    });

    console.log("Fetched posts from API:", res.data); 

    setPosts(Array.isArray(res.data) ? res.data : res.data?.results || []);
  } catch (err) {
    console.error("Failed to fetch posts", err);
    setPosts([]);
  }
};

  // Handle sidebar navigation
  const handleNavigate = (selected: "published" | "draft" | "create") => {
    setView(selected);
    if (selected === "published" || selected === "draft") {
      fetchPosts(selected);
    }
  };

  // After post creation
  const handleSuccess = () => {
    setView("published");
    fetchPosts("published");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full h-64">
        <img src="/image/img.jpg" alt="Banner" className="w-full h-full object-cover" />
      </div>

      <div className="min-h-screen bg-white flex flex-col md:flex-row">
        <Sidebar user={user} onNavigate={handleNavigate} />

        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {view === "published" && "Published Posts"}
            {view === "draft" && "Your Drafts"}
            {view === "create" && "Create New Post"}
          </h2>

          {view === "create" ? (
            <CreatePostForm onSuccess={handleSuccess} />
          ) : (
            <>
              {posts.length === 0 ? (
                <p className="text-gray-500">No posts found.</p>
              ) : (
                <div className="space-y-4">
                  {posts.map((post: any, idx: number) => (
                    <PostCard key={idx} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

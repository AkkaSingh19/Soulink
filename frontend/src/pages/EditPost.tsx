import React from "react";
import Sidebar from "../components/Sidebar";
import EditPostForm from "../components/EditPostForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function EditPost() {
  const [user, setUser] = useState<any>(null);
  const { id } = useParams();
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

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
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full h-64">
        <img src="/image/img.jpg" alt="Banner" className="w-full h-full object-cover" />
      </div>

      <div className="min-h-screen bg-white flex flex-col md:flex-row">
        <Sidebar user={user} onNavigate={() => {}} />

        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-6">Edit Post</h2>
          {id ? <EditPostForm postId={id} /> : <p>Invalid post ID</p>}
        </main>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Header } from "../components/Header"; 
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/fallback/ImageWithFallback";
import { Calendar, User } from "lucide-react";

const AllStories: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/blog/api/posts/")
      .then(res => res.json())
      .then(data => {
        const arr: any[] = Array.isArray(data) ? data : (data?.results ?? []);
        const mapped = arr.map(p => ({
          id: p.id,
          title: p.title,
          published_date: p.publish,
          author_name: p.author || "Unknown",
          image: p.image,
          tags: p.tags ?? [],
          read_time: p.read_time ?? 2,
        }));
        setPosts(mapped);
      })
      .catch(err => console.error("Error fetching posts:", err));
  }, []);

  const formatPublish = (s: string | undefined) => {
    if (!s) return "—";
    const [datePart, timePart = "00:00:00"] = s.split(" ");
    const [y, m, d] = datePart.split("-").map(Number);
    const [hh, mm, ss] = timePart.split(":").map(Number);
    const dte = new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0, ss ?? 0);
    if (isNaN(dte.getTime())) return s;
    return dte.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div>
      <Header />

      {/* Page Title and View Toggle */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">All Stories</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 rounded ${viewMode === "grid" ? "bg-purple-400 text-white" : "bg-gray-200"}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 rounded ${viewMode === "list" ? "bg-purple-400 text-white" : "bg-gray-200"}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className={`max-w-6xl mx-auto px-4 ${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}>
        {posts.map(post => (
      <Card
        key={post.id}
        className={`group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-md 
          ${viewMode === "list" ? "grid grid-cols-[8rem_1fr] gap-4 p-4" : ""}`}
        onClick={() => navigate(`/posts/${post.id}`)}
      >
        {/* Image */}
        <div className="w-32 h-32 overflow-hidden rounded-md">
          <ImageWithFallback
            src={post.image || "https://via.placeholder.com/300"}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <CardContent
          className={`${
            viewMode === "list" ? "p-0 flex flex-col justify-between" : "p-6 flex flex-col justify-between"
          }`}
        >
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
              {post.title}
            </h3>

            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags?.length > 0 ? (
                post.tags.map((tag: any) => (
                  <button
                    key={tag.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/tags/${encodeURIComponent(tag.name)}`);
                    }}
                    className="bg-purple-100 text-black px-3 py-1 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors"
                  >
                    #{tag.name}
                  </button>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No tags</span>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{post.author_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatPublish(post.published_date)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

        ))}
      </div>
    </div>
  );
};

export default AllStories;

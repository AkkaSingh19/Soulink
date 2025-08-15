import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "./fallback/ImageWithFallback";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-purple-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                Soulink
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-lg">
                Connect ideas, share stories, and build meaningful links with a global community of writers and thinkers.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/signin")}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create New Post
              </button>
              <button 
              onClick={() => {
                document.getElementById("featured-stories")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-purple-600 hover:text-purple-700 transition-colors text-left">
                Explore featured posts →
              </button>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=faces"
                alt="People collaborating and sharing ideas"
                className="w-full h-auto rounded-2xl shadow-lg object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">✍️</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Join the conversation</p>
                    <p className="text-xs text-gray-500">Share your unique perspective</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

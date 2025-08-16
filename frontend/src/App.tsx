import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturedPosts } from "./components/FeaturedPosts";
import { NewsletterSection } from "./components/NewsletterSection";
import AllStories from "./pages/AllPosts";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import PostDetails from "./components/PostDetails";
import EditPost from "./pages/EditPost";
import TagsPage from "./pages/TagsPage";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturedPosts />
        <NewsletterSection />
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Home / Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Post Routes */}
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />

        <Route path="/stories" element={<AllStories />} />
        <Route path="/tags/:tags" element={<TagsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

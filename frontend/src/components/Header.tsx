import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Menu, Undo2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";


export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else if (location.pathname !== "/") {
      window.location.href = "/#contact";
    }
  };

  const triggerSearch = () => {
    const query = searchTerm.trim();
    if (!query) return;
    navigate(`/stories?search=${encodeURIComponent(query)}`);
    setIsMenuOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
          <img
            src="/image/soulink-logo.png"
            alt="Soulink Logo"
            className="w-8 h-8 object-contain rounded-lg"
          />
          <span className="text-xl font-semibold text-gray-900">Soulink</span>
        </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-900 hover:text-purple-600 transition-colors">Home</Link>
            <Link to="/stories" className="text-gray-600 hover:text-purple-600 transition-colors">Blog</Link>
            <a
              href="#contact"
              onClick={handleScroll}
              className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer"
            >
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4 relative">
            <div className="relative w-64">
              <Search
                onClick={triggerSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer"
              />
              <Input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
                className="pl-10 pr-8 bg-gray-50 border-gray-200"
              />
              {searchTerm && (
                <Undo2
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-600"
                />
              )}
            </div>
            <Button asChild variant="ghost" className="text-gray-600">
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-900 hover:text-purple-600 transition-colors">
                Home
              </Link>
              <Link to="/stories" className="text-gray-600 hover:text-purple-600 transition-colors">
                Blog
              </Link>
              <a
                href="#contact"
                onClick={(e) => {
                  setIsMenuOpen(false);
                  handleScroll(e);
                }}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Contact
              </a>

              {/* Mobile Search */}
              <div className="pt-4 border-t border-gray-200 relative">
                <div className="flex flex-col space-y-3">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
                      className="bg-gray-50 border-gray-200 pr-8"
                    />
                    {searchTerm && (
                      <Undo2
                        onClick={clearSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-600"
                      />
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <Button asChild variant="ghost" className="text-gray-600 flex-1">
                      <Link to="/signin">Sign In</Link>
                    </Button>
                    <Button asChild className="bg-purple-600 hover:bg-purple-700 flex-1">
                      <Link to="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

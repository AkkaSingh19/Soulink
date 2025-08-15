import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const handleScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById("contact");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      if (location.pathname !== "/") {
        window.location.href = "/#contact";
      }
    }
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Soulink</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-900 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link to="/stories" className="text-gray-600 hover:text-purple-600 transition-colors">
              Blog
            </Link>
            <a
              href="#featured-stories"
              onClick={handleScroll}
              className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer"
            >
              Contact
            </a>
          </nav>

          {/* Search and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 w-64 bg-gray-50 border-gray-200"
              />
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
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
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col space-y-3">
                  <Input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-50 border-gray-200"
                  />
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

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export function NewsletterSection() {
  const [email, setEmail] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const footerSections: FooterSection[] = [
    {
      title: "Company",
      links: [
        { label: "About Soulink", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
        { label: "Contact", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "Writing Guide", href: "#" },
        { label: "Community", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "DMCA", href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" }
  ];

  const handleSubscribe = (e: React.FormEvent): void => {
    e.preventDefault();
    if (email) {
      console.log("Subscribing email:", email);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section id="contact" className="bg-gradient-to-r from-purple-100 to-blue-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Newsletter Subscription */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Stay Connected with Soulink
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the latest stories, writing tips, and community updates delivered to your inbox weekly.
          </p>

          <div className="max-w-md mx-auto">
            {isSubscribed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800">Thanks for subscribing! Check your email for confirmation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white border-gray-300"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 px-8"
                >
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-12 border-t border-purple-200">
          {/* Brand Section */}
              <div className="space-y-4">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <img
                src="/image/soulink-logo.png"
                alt="Soulink Logo"
                className="w-8 h-8 object-contain rounded-lg"
              />
              <span className="text-xl font-semibold text-gray-900">Soulink</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Connecting ideas, sharing stories, and building meaningful links with a global community.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  className="text-gray-400 hover:text-purple-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-gray-900 mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-gray-600 hover:text-purple-600 transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-purple-200 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Soulink. All rights reserved. Made with ❤️ for storytellers worldwide.
          </p>
        </div>
      </div>
    </section>
  );
}
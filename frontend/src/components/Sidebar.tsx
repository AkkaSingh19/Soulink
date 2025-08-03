import React from "react";
import { FileText, File, LogOut } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { GeneratedAvatar } from "./Generated-avatar";
import { signOut } from "../utils/signout";

type SidebarProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
  onNavigate: (view: "published" | "draft" | "create") => void;
};

export default function Sidebar({ user, onNavigate }: SidebarProps) {
  return (
    <aside className="w-full md:w-1/4 p-4">
      <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center -mt-24">
        {/* Profile */}
        <div className="flex flex-col items-center mb-4">
          {user?.image ? (
            <Avatar className="w-24 h-24 mb-2">
              <AvatarImage
                src={user.image}
                className="w-full h-full object-cover rounded-full"
              />
            </Avatar>
          ) : (
            <GeneratedAvatar
              seed={user?.name || "User"}
              variant="initials"
              className="w-24 h-24 rounded-full bg-purple-300 mb-2"
            />
          )}
          <h3 className="text-lg font-semibold">{user?.name}</h3>
          <p className="text-sm text-gray-500">{user?.email || "guest123@gmail.com"}</p>
        </div>

        {/* Stats */}
        <div className="flex justify-around w-full text-center mb-4">
          <div>
            <p className="font-bold">12</p>
            <p className="text-sm text-gray-500">Posts Published</p>
          </div>
          <div>
            <p className="font-bold">34</p>
            <p className="text-sm text-gray-500">Comments Received</p>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => onNavigate("create")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg mb-4 w-full"
        >
          Create New Post
        </button>

        <ul className="space-y-2 w-full">
          <li
            onClick={() => onNavigate("draft")}
            className="flex items-center gap-2 cursor-pointer hover:text-purple-600"
          >
            <FileText size={18} /> Drafts
          </li>
          <li
            onClick={() => onNavigate("published")}
            className="flex items-center gap-2 cursor-pointer hover:text-purple-600"
          >
            <File size={18} /> Active Posts
          </li>
          <li
            onClick={signOut}
            className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-700"
          >
            <LogOut size={18} />
            Sign Out
          </li>
        </ul>
      </div>
    </aside>
  );
}

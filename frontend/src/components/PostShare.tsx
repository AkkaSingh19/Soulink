import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Copy, Facebook, Mail, Twitter } from "lucide-react";

export function ShareMenu({ postUrl, open, setOpen }: { postUrl: string; open: boolean; setOpen: (v: boolean) => void }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Share this post</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <button
            type="button"
            onClick={() => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`)}
            className="flex flex-col items-center hover:scale-110 transition"
          >
            <Facebook className="h-8 w-8 text-blue-600" />
            <span className="text-sm mt-1">Facebook</span>
          </button>

          <button
            type="button"
            onClick={() => openShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`)}
            className="flex flex-col items-center hover:scale-110 transition"
          >
            <Twitter className="h-8 w-8 text-sky-500" />
            <span className="text-sm mt-1">Twitter</span>
          </button>

          <button
            type="button"
            onClick={() => openShare(`mailto:?subject=Check this post&body=${encodeURIComponent(postUrl)}`)}
            className="flex flex-col items-center hover:scale-110 transition"
          >
            <Mail className="h-8 w-8 text-red-500" />
            <span className="text-sm mt-1">Email</span>
          </button>

          <button type="button" onClick={copyLink} className="flex flex-col items-center hover:scale-110 transition">
            <Copy className="h-8 w-8 text-gray-600" />
            <span className="text-sm mt-1">{copied ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

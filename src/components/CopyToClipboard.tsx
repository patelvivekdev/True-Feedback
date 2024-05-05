"use client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

function CopyToClipboard({ profileUrl }: { profileUrl: string }) {

  const handleCopy = (profileUrl: string) => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL has been copied to clipboard.");
  };

  return <Button onClick={() => handleCopy(profileUrl)}>Copy</Button>;
}

export default CopyToClipboard;

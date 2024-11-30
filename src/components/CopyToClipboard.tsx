'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

function CopyToClipboard({ profileUrl }: { profileUrl: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (profileUrl: string) => {
    await navigator.clipboard.writeText(profileUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <Button onClick={() => handleCopy(profileUrl)} variant="secondary" size="icon">
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

export default CopyToClipboard;

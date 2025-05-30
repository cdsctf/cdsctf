import { useState } from "react";

import { copyToClipboard } from "@/utils/clipboard";

function useClipboard(): {
  isCopied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
} {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    setIsCopied(success);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return { isCopied, copyToClipboard: handleCopy };
}

export { useClipboard };

"use client";

import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 max-w-sm bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
      <div className="w-9 h-9 rounded-xl bg-[#C8F31D] text-[#1C2A00] flex items-center justify-center font-black text-sm flex-shrink-0">
        P
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
          Install PaddleUp App
        </h4>
        <p className="text-[11px] text-neutral-500 truncate">
          Instant offline player passport access.
        </p>
      </div>
      <button
        type="button"
        onClick={handleInstallClick}
        className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-90 flex items-center gap-1"
      >
        <Download className="w-3 h-3" />
        <span>Install</span>
      </button>
      <button
        type="button"
        onClick={() => setShowPrompt(false)}
        className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}


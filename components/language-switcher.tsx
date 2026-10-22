"use client";

import React, { useState } from "react";
import { SupportedLanguage } from "@/lib/types";
import { Globe } from "lucide-react";

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fil", label: "FIL" },
  { code: "zh", label: "中文" },
];

function getStoredLang(): SupportedLanguage {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/paddleup_lang=([^;]+)/);
  if (match && (match[1] === "en" || match[1] === "fil" || match[1] === "zh")) {
    return match[1] as SupportedLanguage;
  }
  return "en";
}

function persistLang(lang: SupportedLanguage) {
  if (typeof document !== "undefined") {
    document.cookie = `paddleup_lang=${lang}; path=/; max-age=31536000`;
  }
}

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(getStoredLang);
  const [open, setOpen] = useState(false);

  const handleSelect = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    setOpen(false);
    persistLang(lang);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        title="Switch language (EN, FIL, 中文)"
      >
        <Globe className="w-3.5 h-3.5 text-neutral-500" />
        <span className="uppercase">{currentLang}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-24 bg-white dark:bg-[#1C1C1E] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg p-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                currentLang === lang.code
                  ? "bg-[#C8F31D] text-[#1C2A00]"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span>{lang.label}</span>
              <span className="text-[10px] opacity-60 uppercase">{lang.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


"use client";

import React from "react";
import { Printer } from "lucide-react";

export function PrintResumeButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          window.print();
        }
      }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-90 transition-opacity shadow-xs"
    >
      <Printer className="w-4 h-4" />
      <span>Print / Save as PDF</span>
    </button>
  );
}


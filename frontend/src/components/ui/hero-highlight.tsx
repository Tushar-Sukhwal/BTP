// components/ui/hero-highlight.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div className={cn("relative w-full", containerClassName)}>
      <div
        className={cn(
          "absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-blue-900/40 opacity-50 blur-3xl",
          className
        )}
      />
      <div className="relative">{children}</div>
    </div>
  );
};

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
};

"use client";

import type React from "react";
import { cn } from "@/lib/utils";

interface ClientBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ClientBody({ children, className }: ClientBodyProps) {
  return (
    <body className={cn("font-sans antialiased", className)}>{children}</body>
  );
}

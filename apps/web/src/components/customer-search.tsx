"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Component that displays a search input
interface CustomerSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function CustomerSearch({
  onSearch,
  placeholder = "Zoek op naam, telefoon of email...",
}: CustomerSearchProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 bg-card border-border shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
        />
      </div>
    </div>
  );
}

"use client";

import { AlbumSelector } from "./album-selector";

interface AlbumSelectorWrapperProps {
  albums: { id: string; name: string }[];
  selectedId: string;
}

export function AlbumSelectorWrapper({
  albums,
  selectedId,
}: AlbumSelectorWrapperProps) {
  return (
    <AlbumSelector
      albums={albums}
      selectedId={selectedId}
      onSelect={(id) => {
        window.location.href = `/?category=${encodeURIComponent(id)}`;
      }}
    />
  );
}

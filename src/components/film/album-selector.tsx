"use client";

import { motion } from "framer-motion";

interface Album {
  id: string;
  name: string;
}

interface AlbumSelectorProps {
  albums: Album[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AlbumSelector({
  albums,
  selectedId,
  onSelect,
}: AlbumSelectorProps) {
  return (
    <div className="flex justify-center items-center gap-[18px]">
      {albums.map((album) => {
        const isSelected = album.id === selectedId;
        return (
          <motion.button
            key={album.id}
            onClick={() => onSelect(album.id)}
            className="flex flex-col items-center gap-[12px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-[40px] h-[40px]">
              <div
                className={`w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? "bg-[radial-gradient(circle_at_35%_35%,#5a5a5a,#252525)] border-2 border-neutral-400 shadow-[0_4px_18px_rgba(0,0,0,0.35)]"
                    : "bg-[radial-gradient(circle_at_35%_35%,#5a5a5a,#252525)] border-2 border-neutral-700 shadow-[0_3px_12px_rgba(0,0,0,0.25)]"
                }`}
              >
                <div
                  className={`w-[14px] h-[14px] rounded-full bg-[#1a1a1a] transition-all duration-300 ${
                    isSelected ? "border-[1.5px] border-neutral-200" : "border-[1.5px] border-neutral-600"
                  }`}
                />
              </div>
              <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-[8px] h-[6px] bg-[#3a3a3a] rounded-t-[2px]" />
            </div>
            <span
              className={`text-[10px] transition-colors duration-300 ${
                isSelected
                  ? "text-neutral-800 dark:text-neutral-200 font-medium"
                  : "text-neutral-500"
              }`}
            >
              {album.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

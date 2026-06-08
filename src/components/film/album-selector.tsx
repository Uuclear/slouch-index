"use client";

import { motion } from "framer-motion";

interface Album {
  id: string;
  name: string;
  coverUrl?: string;
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
    <div className="flex justify-center items-end gap-8 flex-wrap">
      {albums.map((album) => {
        const isSelected = album.id === selectedId;
        return (
          <motion.button
            key={album.id}
            onClick={() => onSelect(album.id)}
            className="flex flex-col items-center gap-3"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Thumbnail + canister side by side */}
            <div className="flex items-center gap-2">
              {/* First photo thumbnail (film emerging) */}
              {album.coverUrl && (
                <div
                  className="overflow-hidden rounded-[2px]"
                  style={{
                    width: "50px",
                    height: "33px",
                    boxShadow: isSelected
                      ? "0 2px 12px rgba(0,0,0,0.2)"
                      : "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={album.coverUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: isSelected ? "none" : "brightness(0.7)" }}
                  />
                </div>
              )}
              {/* Vertical canister body */}
              <div
                className="rounded-[10px] border-2 flex items-center justify-center relative"
                style={{
                  width: "30px",
                  height: "55px",
                  background: isSelected
                    ? "linear-gradient(135deg, #5a5a5a, #2a2a2a)"
                    : "linear-gradient(135deg, #4a4a4a, #222)",
                  borderColor: isSelected ? "#999" : "#555",
                  boxShadow: isSelected
                    ? "0 6px 20px rgba(0,0,0,0.35)"
                    : "0 3px 10px rgba(0,0,0,0.2)",
                }}
              >
                {/* Spool */}
                <div
                  className="rounded-full border flex items-center justify-center"
                  style={{
                    width: "13px",
                    height: "13px",
                    borderColor: isSelected ? "#bbb" : "#777",
                  }}
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: "5px",
                      height: "5px",
                      background: "#111",
                    }}
                  />
                </div>
                {/* Top cap */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 rounded-t-[4px]"
                  style={{
                    top: "-5px",
                    width: "16px",
                    height: "5px",
                    background: "linear-gradient(to bottom, #777, #555)",
                  }}
                />
                {/* Film exit slot */}
                <div
                  className="absolute rounded-r-[1px]"
                  style={{
                    left: 0,
                    top: "30%",
                    width: "2px",
                    height: "40%",
                    background: "#0a0a0a",
                  }}
                />
              </div>
            </div>
            {/* Album name */}
            <span
              className="text-xs tracking-wide"
              style={{
                color: isSelected
                  ? "var(--text-active, #1a1a1a)"
                  : "var(--text-inactive, #999)",
                fontWeight: isSelected ? 500 : 400,
              }}
            >
              {album.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

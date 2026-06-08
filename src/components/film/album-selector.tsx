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
    <div className="flex justify-center items-center gap-4 flex-wrap px-4">
      {albums.map((album) => {
        const isSelected = album.id === selectedId;
        return (
          <motion.button
            key={album.id}
            onClick={() => onSelect(album.id)}
            className="flex flex-col items-center gap-2 relative"
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Mini film strip with canister */}
            <div className="flex items-center">
              {/* Film leader tip */}
              <svg
                width="14"
                height="50"
                viewBox="0 0 14 50"
                className="flex-shrink-0"
              >
                <path
                  d="M0,8 L10,0 L14,0 L14,50 L10,50 L0,42 Z"
                  fill={isSelected ? "#4a3020" : "#3a2818"}
                />
              </svg>

              {/* Film strip body */}
              <div className="flex flex-col">
                {/* Top perforations */}
                <div
                  className="flex items-center"
                  style={{
                    height: "8px",
                    backgroundColor: isSelected ? "#3d2a1a" : "#2d1a10",
                    paddingLeft: "2px",
                  }}
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 rounded-[0.5px]"
                      style={{
                        width: "4px",
                        height: "3px",
                        marginRight: "5px",
                        backgroundColor: "#8b6914",
                        opacity: 0.6,
                      }}
                    />
                  ))}
                </div>

                {/* Photo area */}
                <div
                  className="flex items-center"
                  style={{
                    backgroundColor: isSelected ? "#4a3020" : "#3a2818",
                    padding: "0 3px",
                    height: "34px",
                  }}
                >
                  {album.coverUrl ? (
                    <img
                      src={album.coverUrl}
                      alt=""
                      className="h-full w-[45px] object-cover rounded-[1px]"
                      style={{
                        filter: isSelected ? "none" : "brightness(0.65)",
                      }}
                    />
                  ) : (
                    <div
                      className="h-full w-[45px] rounded-[1px]"
                      style={{
                        backgroundColor: isSelected ? "#3a2818" : "#2a1810",
                      }}
                    />
                  )}
                </div>

                {/* Bottom perforations */}
                <div
                  className="flex items-center"
                  style={{
                    height: "8px",
                    backgroundColor: isSelected ? "#3d2a1a" : "#2d1a10",
                    paddingLeft: "2px",
                  }}
                >
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 rounded-[0.5px]"
                      style={{
                        width: "4px",
                        height: "3px",
                        marginRight: "5px",
                        backgroundColor: "#8b6914",
                        opacity: 0.6,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Mini canister on the right */}
              <div
                className="flex-shrink-0 flex items-center justify-center rounded border"
                style={{
                  width: "18px",
                  height: "50px",
                  background: isSelected
                    ? "linear-gradient(135deg, #555 0%, #2a2a2a 50%, #3a3a3a 100%)"
                    : "linear-gradient(135deg, #444 0%, #222 50%, #333 100%)",
                  borderColor: isSelected ? "#777" : "#555",
                  boxShadow: isSelected
                    ? "0 3px 10px rgba(0,0,0,0.3)"
                    : "0 1px 4px rgba(0,0,0,0.2)",
                  marginLeft: "-1px",
                  position: "relative",
                }}
              >
                {/* Film exit slot */}
                <div
                  className="absolute"
                  style={{
                    left: 0,
                    top: "20%",
                    width: "2px",
                    height: "60%",
                    background: "#0a0a0a",
                    borderRadius: "0 1px 1px 0",
                  }}
                />
                {/* Spool */}
                <div
                  className="rounded-full border flex items-center justify-center"
                  style={{
                    width: "10px",
                    height: "10px",
                    borderColor: isSelected ? "#999" : "#666",
                  }}
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: "4px",
                      height: "4px",
                      background: "#111",
                    }}
                  />
                </div>
                {/* Top cap */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 rounded-t"
                  style={{
                    top: "-3px",
                    width: "12px",
                    height: "3px",
                    background: "linear-gradient(to bottom, #666, #444)",
                  }}
                />
                {/* Bottom cap */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 rounded-b"
                  style={{
                    bottom: "-3px",
                    width: "12px",
                    height: "3px",
                    background: "linear-gradient(to top, #666, #444)",
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

            {/* Selected indicator dot */}
            {isSelected && (
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: "#8b6914",
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

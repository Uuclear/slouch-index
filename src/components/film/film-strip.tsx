"use client";

import { useState, useRef, useEffect } from "react";

interface Photo {
  id: string;
  title: string;
  imageUrl: string;
}

interface FilmStripProps {
  photos: Photo[];
}

export function FilmStrip({ photos }: FilmStripProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasDragged = useRef(false);

  useEffect(() => {
    setCurrentIndex(0);
    setDragDelta(0);
  }, [photos]);

  const goToPrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const goToNext = () =>
    setCurrentIndex((prev) => Math.min(photos.length - 1, prev + 1));

  const getClientX = (e: React.MouseEvent | React.TouchEvent) =>
    "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

  const getEndClientX = (e: React.MouseEvent | React.TouchEvent) =>
    "changedTouches" in e
      ? e.changedTouches[0].clientX
      : (e as React.MouseEvent).clientX;

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    hasDragged.current = false;
    dragStartX.current = getClientX(e);
    setDragDelta(0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const delta = getClientX(e) - dragStartX.current;
    setDragDelta(delta);
    if (Math.abs(delta) > 5) hasDragged.current = true;
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = getEndClientX(e) - dragStartX.current;

    if (Math.abs(delta) > 50) {
      if (delta < 0) {
        // Dragging left - try to go next
        if (currentIndex < photos.length - 1) {
          goToNext();
          setDragDelta(0);
          return;
        }
        // Past last photo: snap back smoothly (don't change currentIndex)
      } else {
        // Dragging right - go prev
        goToPrev();
        setDragDelta(0);
        return;
      }
    }

    // Snap back smoothly to current position
    requestAnimationFrame(() => setDragDelta(0));
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hasDragged.current) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const w = rect.width;
    if (x < w * 0.3) goToPrev();
    else if (x > w * 0.7) goToNext();
  };

  if (photos.length === 0) {
    return (
      <div className="rounded-lg p-8 text-center text-neutral-500" style={{ backgroundColor: "#2a1a0f" }}>
        暂无作品
      </div>
    );
  }

  // Responsive: larger photos on desktop, smaller on mobile
  const photoWidth = typeof window !== "undefined" && window.innerWidth < 640 ? 260 : 380;
  const photoHeight = Math.round(photoWidth * 2 / 3);
  const frameWidth = photoWidth + 20; // 10px margin each side
  const leaderWidth = 120;

  // Calculate how many perforations we need
  // Each frame width ~400px, perf spacing ~16px (7px + 9px gap)
  const perfSpacing = 16;
  const totalPerfs = Math.ceil(
    ((photos.length + 2) * frameWidth + leaderWidth) / perfSpacing
  ) + 10;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none mx-auto"
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        maxWidth: "1100px",
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={(e) => {
        if (isDragging) handleDragEnd(e);
      }}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      onClick={handleClick}
    >
      {/* Film strip content */}
      <div
        className="flex flex-col"
        style={{
          width: `${(photos.length + 2) * frameWidth + leaderWidth}px`,
          transform: `translateX(calc(50% - ${(currentIndex + 0.5) * frameWidth}px + ${dragDelta}px))`,
          transition: isDragging
            ? "none"
            : "transform 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        {/* Top perforations - amber/brown color like real film */}
        <div
          className="flex items-center"
          style={{
            height: "18px",
            backgroundColor: "#3d2a1a",
            paddingLeft: "8px",
            paddingRight: "8px",
          }}
        >
          {Array.from({ length: totalPerfs }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-[0.5px]"
              style={{
                width: "7px",
                height: "5px",
                marginRight: "9px",
                backgroundColor: "#8b6914",
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* Film body - amber/brown translucent color */}
        <div
          className="flex items-stretch"
          style={{ backgroundColor: "#4a3020" }}
        >
          {/* Film leader (beginning of film) */}
          <div
            className="flex-shrink-0 relative"
            style={{ width: `${leaderWidth}px` }}
          >
            {/* Leader tapered tongue shape */}
            <svg
              viewBox="0 0 120 300"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              style={{ filter: "drop-shadow(2px 0 4px rgba(0,0,0,0.3))" }}
            >
              {/* Leader body */}
              <path
                d="M0,0 L90,0 L120,30 L120,270 L90,300 L0,300 Z"
                fill="#4a3020"
              />
              {/* Lighter stripe (DX code area) */}
              <rect x="10" y="120" width="60" height="60" fill="#5a4030" opacity="0.6" />
              {/* Film brand text area */}
              <rect x="15" y="130" width="50" height="10" fill="#6a5040" opacity="0.4" />
              <rect x="15" y="145" width="35" height="8" fill="#6a5040" opacity="0.3" />
            </svg>
            {/* Arrow indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 left-3"
              style={{
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderLeft: "8px solid #8b6914",
                opacity: 0.5,
              }}
            />
          </div>

          {/* Photo frames */}
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="flex-shrink-0 flex flex-col"
              style={{ width: `${frameWidth}px` }}
            >
              {/* Frame number top */}
              <div className="flex items-center justify-center" style={{ height: "16px" }}>
                <span
                  style={{
                    fontSize: "7px",
                    letterSpacing: "0.1em",
                    color: "#8b6914",
                    opacity: 0.5,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}A
                </span>
              </div>
              {/* Photo */}
              <div style={{ padding: "0 10px" }}>
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  draggable={false}
                  className="w-full block rounded-[1px]"
                  style={{
                    height: `${photoHeight}px`,
                    objectFit: "cover",
                    boxShadow:
                      index === currentIndex
                        ? "0 0 40px rgba(255,200,100,0.15)"
                        : "none",
                    transition: "box-shadow 0.3s ease",
                  }}
                />
              </div>
              {/* Frame number bottom */}
              <div className="flex items-center justify-center" style={{ height: "16px" }}>
                <span
                  style={{
                    fontSize: "7px",
                    letterSpacing: "0.1em",
                    color: "#8b6914",
                    opacity: 0.5,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}A
                </span>
              </div>
            </div>
          ))}

          {/* Two blank placeholder frames (unexposed film tail) */}
          {[0, 1].map((i) => (
            <div
              key={`blank-${i}`}
              className="flex-shrink-0 flex flex-col"
              style={{ width: `${frameWidth}px` }}
            >
              {/* Frame number top */}
              <div className="flex items-center justify-center" style={{ height: "16px" }}>
                <span
                  style={{
                    fontSize: "7px",
                    letterSpacing: "0.1em",
                    color: "#8b6914",
                    opacity: 0.3,
                  }}
                >
                  {String(photos.length + i + 1).padStart(2, "0")}A
                </span>
              </div>
              {/* Unexposed film area */}
              <div style={{ padding: "0 10px" }}>
                <div
                  className="w-full rounded-[1px]"
                  style={{
                    height: `${photoHeight}px`,
                    backgroundColor: "#3a2818",
                  }}
                />
              </div>
              {/* Frame number bottom */}
              <div className="flex items-center justify-center" style={{ height: "16px" }}>
                <span
                  style={{
                    fontSize: "7px",
                    letterSpacing: "0.1em",
                    color: "#8b6914",
                    opacity: 0.3,
                  }}
                >
                  {String(photos.length + i + 1).padStart(2, "0")}A
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom perforations */}
        <div
          className="flex items-center"
          style={{
            height: "18px",
            backgroundColor: "#3d2a1a",
            paddingLeft: "8px",
            paddingRight: "8px",
          }}
        >
          {Array.from({ length: totalPerfs }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 rounded-[0.5px]"
              style={{
                width: "7px",
                height: "5px",
                marginRight: "9px",
                backgroundColor: "#8b6914",
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      {/* Right-side canister (fixed position) */}
      <div
        className="absolute right-0 top-0 bottom-0 z-10 flex items-center pointer-events-none"
        style={{ width: "100px" }}
      >
        {/* Canister body */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div
            className="relative rounded-xl border-2 flex items-center justify-center"
            style={{
              width: "55px",
              height: "calc(100% - 20px)",
              minHeight: `${photoHeight + 60}px`,
              background:
                "linear-gradient(135deg, #555 0%, #2a2a2a 45%, #3a3a3a 100%)",
              borderColor: "#555",
              boxShadow:
                "inset 0 0 15px rgba(0,0,0,0.4), -4px 0 20px rgba(0,0,0,0.5)",
            }}
          >
            {/* Film exit slot - spans full film height */}
            <div
              className="absolute rounded-r-[1px]"
              style={{
                left: 0,
                top: "15%",
                width: "4px",
                height: "70%",
                background: "#1a1008",
              }}
            />

            {/* Spool (center) */}
            <div
              className="rounded-full border-2 flex items-center justify-center"
              style={{
                width: "24px",
                height: "24px",
                borderColor: "#777",
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: "10px",
                  height: "10px",
                  background: "#1a1a1a",
                }}
              />
            </div>

            {/* Top cap */}
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-md"
              style={{
                top: "-8px",
                width: "30px",
                height: "8px",
                background: "linear-gradient(to bottom, #666, #444)",
              }}
            />
            {/* Bottom cap */}
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-md"
              style={{
                bottom: "-8px",
                width: "30px",
                height: "8px",
                background: "linear-gradient(to top, #666, #444)",
              }}
            />

            {/* DX code strip */}
            <div className="absolute right-2 top-1/4 flex flex-col gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "6px",
                    height: "3px",
                    backgroundColor: i % 2 === 0 ? "#888" : "#444",
                    borderRadius: "1px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right edge fade - removed per user request */}
      {/* Left edge fade - removed per user request */}
    </div>
  );
}

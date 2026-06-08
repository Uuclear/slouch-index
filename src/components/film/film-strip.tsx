"use client";

import { useState, useRef, useCallback, useEffect } from "react";

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

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(photos.length - 1, prev + 1));
  }, [photos.length]);

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
      if (delta < 0) goToNext();
      else goToPrev();
    }
    setDragDelta(0);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hasDragged.current) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const w = rect.width;
    if (x < w * 0.35) goToPrev();
    else if (x > w * 0.65) goToNext();
  };

  if (photos.length === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg p-8 text-center text-neutral-500">
        暂无作品
      </div>
    );
  }

  const perfCount = Math.ceil(photos.length * 22) + 50;
  const frameNums = photos.map((_, i) => `${String(i + 1).padStart(2, "0")}A`);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden max-w-[1000px] mx-auto select-none"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
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
      {/* Film strip */}
      <div
        className="flex flex-col"
        style={{
          width: `calc(${photos.length * 300 + 180}px + 12vw)`,
          transform: `translateX(calc(50% - ${(currentIndex + 0.5) * 300}px + ${dragDelta}px))`,
          transition: isDragging ? "none" : "transform 0.45s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        {/* Top perforations */}
        <div className="h-[16px] bg-[#111] flex items-center px-[6px]">
          {Array.from({ length: perfCount }).map((_, i) => (
            <div
              key={i}
              className="w-[7px] h-[5px] rounded-[0.5px] flex-shrink-0 mr-[9px]"
              style={{ backgroundColor: "#c8c0b0" }}
            />
          ))}
        </div>

        {/* Film body */}
        <div className="flex bg-[#141414]">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="flex-shrink-0 flex flex-col"
              style={{ width: "300px" }}
            >
              {/* Frame number strip */}
              <div className="h-[14px] flex items-center justify-center">
                <span className="text-[7px] tracking-wider opacity-30" style={{ color: "#a09880" }}>
                  {frameNums[index]}
                </span>
              </div>
              {/* Photo */}
              <div className="mx-[10px]">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  draggable={false}
                  className="w-full block rounded-[1px]"
                  style={{ aspectRatio: "3/2", objectFit: "cover" }}
                />
              </div>
              {/* Bottom frame number strip */}
              <div className="h-[14px] flex items-center justify-center">
                <span className="text-[7px] tracking-wider opacity-30" style={{ color: "#a09880" }}>
                  {frameNums[index]}
                </span>
              </div>
            </div>
          ))}

          {/* Film tail (empty film after last photo) */}
          <div className="flex-shrink-0" style={{ width: "180px" }}>
            <div className="h-[14px]" />
            <div className="mx-[10px]" style={{ aspectRatio: "3/2" }} />
            <div className="h-[14px]" />
          </div>

          {/* Extra space for canister area */}
          <div className="flex-shrink-0" style={{ width: "12vw" }} />
        </div>

        {/* Bottom perforations */}
        <div className="h-[16px] bg-[#111] flex items-center px-[6px]">
          {Array.from({ length: perfCount }).map((_, i) => (
            <div
              key={i}
              className="w-[7px] h-[5px] rounded-[0.5px] flex-shrink-0 mr-[9px]"
              style={{ backgroundColor: "#c8c0b0" }}
            />
          ))}
        </div>
      </div>

      {/* Canister overlay (fixed right) */}
      <div
        className="absolute right-0 top-0 bottom-0 z-10 flex items-center pointer-events-none"
        style={{ width: "80px" }}
      >
        {/* Film entering canister shadow */}
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{
            width: "40px",
            background:
              "linear-gradient(to right, transparent, rgba(17,17,17,0.85) 70%, #111)",
          }}
        />
        {/* Canister body */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <div
            className="rounded-[14px] border-2"
            style={{
              width: "55px",
              height: "110px",
              background: "linear-gradient(135deg, #555 0%, #2a2a2a 45%, #3a3a3a 100%)",
              borderColor: "#555",
              boxShadow: "inset 0 0 15px rgba(0,0,0,0.4), -4px 0 20px rgba(0,0,0,0.5)",
            }}
          >
            {/* Spool */}
            <div className="flex items-center justify-center h-full">
              <div
                className="rounded-full border-2 flex items-center justify-center"
                style={{ width: "22px", height: "22px", borderColor: "#777" }}
              >
                <div
                  className="rounded-full"
                  style={{ width: "8px", height: "8px", background: "#1a1a1a" }}
                />
              </div>
            </div>
            {/* Film exit slot */}
            <div
              className="absolute"
              style={{
                left: 0,
                top: "28%",
                width: "3px",
                height: "44%",
                background: "#0a0a0a",
                borderRadius: "0 2px 2px 0",
              }}
            />
            {/* Top cap */}
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-[6px]"
              style={{
                top: "-7px",
                width: "28px",
                height: "7px",
                background: "linear-gradient(to bottom, #666, #444)",
              }}
            />
            {/* Bottom cap */}
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-[6px]"
              style={{
                bottom: "-7px",
                width: "28px",
                height: "7px",
                background: "linear-gradient(to top, #666, #444)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Right edge fade */}
      <div
        className="absolute right-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: "120px",
          background: "linear-gradient(to right, transparent, rgba(250,250,250,0.9))",
        }}
      />
    </div>
  );
}

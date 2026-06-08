"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilmPerforations } from "./film-perforations";

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
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(photos.length - 1, prev + 1));
  }, [photos.length]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    dragStartX.current = clientX;
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const clientX =
      "changedTouches" in e
        ? e.changedTouches[0].clientX
        : (e as React.MouseEvent).clientX;
    const diff = dragStartX.current - clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    if (x < width * 0.3) goToPrev();
    else if (x > width * 0.7) goToNext();
  };

  if (photos.length === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg p-8 text-center text-neutral-400">
        暂无作品
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-[#1a1a1a] rounded-lg overflow-hidden max-w-[850px] mx-auto select-none"
      onClick={handleClick}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
    >
      <FilmPerforations position="top" count={16} />

      <div className="bg-[#2a2a2a] py-3 flex items-center justify-center relative overflow-hidden h-[280px]">
        {currentIndex > 0 && (
          <div className="absolute left-[3%] w-[45px] h-[30px] opacity-25">
            <img
              src={photos[currentIndex - 1].imageUrl}
              alt=""
              className="w-full h-full object-cover rounded-[2px]"
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={photos[currentIndex].id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative w-[380px] h-[253px]"
          >
            <img
              src={photos[currentIndex].imageUrl}
              alt={photos[currentIndex].title}
              className="w-full h-full object-cover rounded-[2px] shadow-[0_0_50px_rgba(255,255,255,0.15)]"
            />
          </motion.div>
        </AnimatePresence>

        {currentIndex < photos.length - 1 && (
          <div className="absolute right-[3%] w-[45px] h-[30px] opacity-25">
            <img
              src={photos[currentIndex + 1].imageUrl}
              alt=""
              className="w-full h-full object-cover rounded-[2px]"
            />
          </div>
        )}

        <div className="absolute left-0 top-0 w-[35%] h-full cursor-pointer z-10" />
        <div className="absolute right-0 top-0 w-[35%] h-full cursor-pointer z-10" />
      </div>

      <FilmPerforations position="bottom" count={16} />

      <div className="text-center py-2 text-neutral-500 text-xs">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
}

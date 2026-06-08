interface FilmPerforationsProps {
  position: "top" | "bottom";
  count?: number;
}

export function FilmPerforations({
  position,
  count = 16,
}: FilmPerforationsProps) {
  return (
    <div
      className={`h-[14px] bg-[#1a1a1a] flex items-center px-2 gap-[12px] ${
        position === "top" ? "rounded-t" : "rounded-b"
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-[7px] h-[5px] bg-[#fafafa] rounded-[1px] flex-shrink-0"
        />
      ))}
    </div>
  );
}

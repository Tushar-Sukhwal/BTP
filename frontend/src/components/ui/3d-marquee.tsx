// components/ui/3d-marquee.tsx
"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const ThreeDMarquee = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Split images into 4 columns
  const columns = [
    images.filter((_, i) => i % 4 === 0),
    images.filter((_, i) => i % 4 === 1),
    images.filter((_, i) => i % 4 === 2),
    images.filter((_, i) => i % 4 === 3),
  ];

  const translateY1 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const translateY2 = useTransform(scrollYProgress, [0, 1], [0, 500]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-[80vh] flex flex-row gap-2 overflow-hidden items-start p-2 perspective",
        className
      )}
    >
      {columns.map((column, columnIndex) => (
        <motion.div
          key={`column-${columnIndex}`}
          className="flex-1 h-full flex flex-col gap-2"
          style={{
            y: columnIndex % 2 === 0 ? translateY1 : translateY2,
          }}
        >
          {column.map((image, imageIndex) => (
            <div
              key={`image-${columnIndex}-${imageIndex}`}
              className="w-full aspect-[4/3] relative rounded-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`Image ${columnIndex}-${imageIndex}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      ))}

      <GridLineVertical className="absolute left-1/4 top-0 bottom-0" />
      <GridLineVertical className="absolute left-2/4 top-0 bottom-0" />
      <GridLineVertical className="absolute left-3/4 top-0 bottom-0" />
      <GridLineHorizontal className="absolute top-1/4 left-0 right-0" />
      <GridLineHorizontal className="absolute top-2/4 left-0 right-0" />
      <GridLineHorizontal className="absolute top-3/4 left-0 right-0" />
    </div>
  );
};

export const GridLineHorizontal = ({
  className,
  offset = "200px",
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      className={cn(
        "absolute h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent",
        className
      )}
      style={{
        left: `-${offset}`,
        right: `-${offset}`,
      }}
    />
  );
};

export const GridLineVertical = ({
  className,
  offset = "150px",
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      className={cn(
        "absolute w-px bg-gradient-to-b from-transparent via-gray-600/50 to-transparent",
        className
      )}
      style={{
        top: `-${offset}`,
        bottom: `-${offset}`,
      }}
    />
  );
};

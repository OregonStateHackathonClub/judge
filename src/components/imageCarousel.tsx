"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  imageUrls: string[];
  altText: string;
}

export function ImageCarousel({ imageUrls, altText }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the previous image, looping to the end if at the start
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? imageUrls.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // Function to go to the next image, looping to the start if at the end
  const goToNext = () => {
    const isLastSlide = currentIndex === imageUrls.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // If there are no images, don't render anything
  if (!imageUrls || imageUrls.length === 0) {
    return null;
  }

  return (
    <div className="relative h-full w-full">
      {/* The main image */}
      <img
        src={imageUrls[currentIndex]}
        alt={altText}
        className="aspect-video w-full object-cover"
      />

      {/* Render navigation buttons only if there is more than one image */}
      {imageUrls.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-neutral-700 bg-black/50 p-1.5 text-white backdrop-blur transition hover:bg-black/75"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-neutral-700 bg-black/50 p-1.5 text-white backdrop-blur transition hover:bg-black/75"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
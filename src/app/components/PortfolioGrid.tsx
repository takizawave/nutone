import { useState } from "react";
import { motion } from "motion/react";
import { Play, X } from "lucide-react";
import { type PortfolioItem, fallbackImages } from "../data/portfolio";

interface PortfolioGridProps {
  items: PortfolioItem[];
  indexOffset?: number;
}

export function PortfolioGrid({ items, indexOffset = 0 }: PortfolioGridProps) {
  const [activeVideo, setActiveVideo] = useState<PortfolioItem | null>(null);
  const [failedThumbs, setFailedThumbs] = useState<Set<string>>(new Set());

  const handleThumbError = (youtubeId: string) => {
    setFailedThumbs((prev) => new Set(prev).add(youtubeId));
  };

  const getThumbSrc = (youtubeId: string, index: number) => {
    if (failedThumbs.has(youtubeId)) return fallbackImages[index % fallbackImages.length];
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {items.map((item, index) => (
          <motion.div
            key={item.youtubeId + index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group cursor-pointer"
            onClick={() => setActiveVideo(item)}
          >
            <div className="relative aspect-video overflow-hidden bg-[#e8e8e8]">
              <img
                src={getThumbSrc(item.youtubeId, index)}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                onError={() => handleThumbError(item.youtubeId)}
              />
              <span
                className="absolute top-3 left-3 text-[var(--text-strong)]/0 group-hover:text-[var(--text-subtle)] transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.4375rem",
                  letterSpacing: "0.1em",
                  fontWeight: 300,
                }}
              >
                {String(indexOffset + index + 1).padStart(3, "0")}
              </span>
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                <div className="w-11 h-11 rounded-full bg-[var(--text-strong)]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                  <Play size={15} className="text-[var(--void)] ml-0.5" fill="var(--void)" />
                </div>
              </div>
            </div>

            <p
              className="mt-4 text-[var(--text-primary)] group-hover:text-[var(--text-strong)] transition-colors duration-300"
              style={{ fontSize: "0.875rem", lineHeight: 1.7, letterSpacing: "0.02em", fontWeight: 400 }}
            >
              {item.title}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl mx-6 md:mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-12 right-0 text-[var(--text-subtle)] hover:text-[var(--text-strong)] transition-colors duration-300 cursor-pointer flex items-center gap-2"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                letterSpacing: "0.06em",
              }}
            >
              Close <X size={15} />
            </button>
            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <p
                className="text-[var(--text-primary)]"
                style={{ fontSize: "0.875rem", letterSpacing: "0.02em", fontWeight: 400, lineHeight: 1.6 }}
              >
                {activeVideo.title}
              </p>
              <a
                href={activeVideo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-secondary)] hover:text-[var(--text-subtle)] transition-colors duration-300 shrink-0"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.06em",
                }}
              >
                YouTube &rarr;
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
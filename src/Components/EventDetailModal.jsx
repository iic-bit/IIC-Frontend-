import React, { useEffect, useState, useCallback } from "react";

export default function EventDetailModal({ event, onClose }) {
  const images = (event && event.galleryImages) || [];
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  // normalize image value (some images may be module objects in CRA)
  const srcFor = (img) => {
    if (!img) return "";
    if (typeof img === "object" && img !== null) {
      return img.default ? img.default : img;
    }
    return img;
  };

  // navigation (wrap-around)
  const prev = useCallback(() => {
    setIndex((i) => {
      if (images.length === 0) return 0;
      return (i - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => {
      if (images.length === 0) return 0;
      return (i + 1) % images.length;
    });
  }, [images.length]);

  // keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "Enter") {
        setZoom((z) => !z);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // reset index if event changes
  useEffect(() => {
    setIndex(0);
    setZoom(false);
  }, [event]);

  if (!event) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        padding: 20,
      }}
      onMouseDown={(e) => {
        // click background to close (but not clicks inside panel)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "min(1100px, 96%)",
          maxHeight: "96%",
          background: "#fff",
          borderRadius: 10,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{event.name}</div>
            <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
              {event.date} • {event.venue}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setZoom((z) => !z)}
              style={{
                border: "1px solid #e6eef0",
                background: "#f8fafb",
                padding: "8px 10px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
              title="Toggle zoom (Enter)"
            >
              {zoom ? "Exit Zoom" : "Zoom"}
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                background: "transparent",
                border: "none",
                fontSize: 22,
                lineHeight: 1,
                cursor: "pointer",
                padding: 6,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body: images + details */}
        <div style={{ display: "flex", gap: 0, alignItems: "stretch", flex: 1, overflow: "hidden" }}>
          {/* LEFT: image area */}
          <div style={{ flex: 1, minWidth: 360, display: "flex", flexDirection: "column", background: "#fff" }}>
            <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f7fafc" }}>
              {/* Prev arrow */}
              <button
                onClick={prev}
                aria-label="Previous image"
                style={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 3,
                  borderRadius: 8,
                  border: "none",
                  background: "rgba(255,255,255,0.9)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  padding: "10px 12px",
                  cursor: "pointer",
                }}
              >
                ‹
              </button>

              {/* Main image */}
              <div
                style={{
                  width: "100%",
                  height: zoom ? "92vh" : 420,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
                onClick={() => setZoom((z) => !z)}
                title="Click to zoom"
              >
                {images && images.length > 0 ? (
                  <img
                    src={srcFor(images[index])}
                    alt={`${event.name} image ${index + 1}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      transition: "transform .18s ease",
                      transform: zoom ? "scale(1.05)" : "none",
                      cursor: "zoom-in",
                    }}
                  />
                ) : (
                  <div style={{ color: "#9ca3af" }}>No images available</div>
                )}
              </div>

              {/* Next arrow */}
              <button
                onClick={next}
                aria-label="Next image"
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 3,
                  borderRadius: 8,
                  border: "none",
                  background: "rgba(255,255,255,0.9)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  padding: "10px 12px",
                  cursor: "pointer",
                }}
              >
                ›
              </button>
            </div>

            {/* Thumbnails */}
            <div style={{ padding: 10, borderTop: "1px solid #f1f5f9", display: "flex", gap: 8, overflowX: "auto", alignItems: "center" }}>
              {images.length > 0 ? (
                images.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    style={{
                      border: i === index ? "2px solid #10b981" : "1px solid #e5e7eb",
                      padding: 0,
                      borderRadius: 6,
                      overflow: "hidden",
                      background: "#fff",
                      cursor: "pointer",
                      minWidth: 80,
                      height: 56,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img src={srcFor(g)} alt={`thumb-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </button>
                ))
              ) : (
                <div style={{ color: "#9ca3af" }}>No thumbnails</div>
              )}
            </div>
          </div>

          {/* RIGHT: details area */}
          <div style={{ width: 420, maxWidth: "40%", borderLeft: "1px solid #f3f4f6", padding: 18, overflowY: "auto" }}>
            <h3 style={{ marginTop: 0 }}>{event.name}</h3>
            <div style={{ color: "#6b7280", marginBottom: 12 }}>{event.date} • {event.venue}</div>

            <div style={{ lineHeight: 1.6, color: "#374151" }}>
              {event.fullDescription || event.shortDescription || "No additional details provided."}
            </div>

            {event.highlights && event.highlights.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <strong style={{ display: "block", marginBottom: 8 }}>Highlights</strong>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {event.highlights.map((h, i) => <li key={i} style={{ color: "#374151", marginBottom: 6 }}>{h}</li>)}
                </ul>
              </div>
            )}

            <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
              <a
                href={images[index] ? srcFor(images[index]) : "#"}
                target="_blank"
                rel="noreferrer"
                style={{ marginLeft: 0, padding: "8px 12px", borderRadius: 8, background: "#0ea5a0", color: "#fff", textDecoration: "none", fontWeight: 600 }}
              >
                Open image in new tab
              </a>
              <button
                onClick={() => {
                  // jump to next image
                  next();
                }}
                style={{ padding: "8px 12px", borderRadius: 8, background: "#f1f5f9", border: "1px solid #e5e7eb", cursor: "pointer" }}
              >
                Next image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

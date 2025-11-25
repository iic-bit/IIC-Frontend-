import React from "react";
export default function EventCard({ event, onClick }) {
  return (
    <div
      onClick={() => onClick && onClick(event)}
      style={{
        cursor: "pointer",
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        minHeight: 340,
      }}
    >
      <div style={{ flex: "0 0 180px", overflow: "hidden", background: "#eee" }}>
        {event.thumbnailImage ? (
          <img
            src={event.thumbnailImage}
            alt={event.name}
            style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
            onError={(e) => {
              e.currentTarget.style.objectFit = "contain";
              e.currentTarget.style.background = "#ddd";
            }}
          />
        ) : (
          <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#777" }}>
            No image
          </div>
        )}
      </div>

      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>{event.name}</h3>
        <div style={{ color: "#6b7280", fontSize: 14 }}>{event.date} • {event.venue}</div>
        <p style={{ marginTop: 6, fontSize: 14, color: "#374151", flex: 1 }}>{event.shortDescription}</p>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={(ev) => { ev.stopPropagation(); onClick && onClick(event); }}
            style={{
              border: "none",
              background: "#0ea5a4",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            View details
          </button>
        </div>
      </div>
    </div>
  );
}

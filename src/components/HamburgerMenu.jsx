import React, { useState, useRef, useEffect } from "react";

export default function HamburgerMenu({ children }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div style={{ position: "fixed", top: "12px", right: "12px", display: "inline-block" }} ref={menuRef}>
      <button
        aria-label="Open advanced settings"
        onClick={() => setOpen((v) => !v)}
        style={{
          border: "1px solid #CBD5E1",
          borderRadius: 8,
          padding: 8,
          cursor: "pointer",
          fontSize: 20,
        }}
      >
        <span style={{ display: "block", width: 24 }}>
          <span style={{ display: "block", height: 3, background: "#334155", margin: "4px 0", borderRadius: 2 }} />
          <span style={{ display: "block", height: 3, background: "#334155", margin: "4px 0", borderRadius: 2 }} />
          <span style={{ display: "block", height: 3, background: "#334155", margin: "4px 0", borderRadius: 2 }} />
        </span>
      </button>
      <div
        style={{
          position: "absolute",
          right: -12, // Move menu slightly left to avoid edge
          top: "100%",
          marginTop: 8,
          zIndex: 100,
          background: "#fff",
          border: "1px solid #CBD5E1",
          borderRadius: 12,
          boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
          minWidth: 340,
          padding: "12px 24px 100px 12px", // Added extra right padding
          transition: "all 0.3s ease-in-out",
          opacity: open ? 1 : 0,
          transform: open ? "translateX(0)" : "translateX(20px)",
          visibility: open ? "visible" : "hidden",
          pointerEvents: open ? "all" : "none",
          maxHeight: "calc(100vh - 100px)", // 30px smaller than screen height
          paddingBottom: 100, // Ensure bottom padding for visibility
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

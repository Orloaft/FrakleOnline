import React, { useState, useEffect, useRef } from "react";

interface GlowingTextProps {
  text: string;
}

const GlowingText: React.FC<GlowingTextProps> = ({ text }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.classList.add("grow");

      const timeoutId = setTimeout(() => {
        if (spanRef.current) {
          spanRef.current.classList.remove("grow");
          spanRef.current.classList.add("fade");
        }
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, []);

  return (
    <span ref={spanRef} className="glowing-text">
      {text}
    </span>
  );
};

export default GlowingText;

import React, { useState, useEffect } from "react";

const AppRipple = ({ children, color = "rgba(0, 0, 0, 0.3)", width }) => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const cleanup = ripples.reduce((acc, ripple) => {
      acc[ripple.id] = setTimeout(() => {
        setRipples((prevRipples) =>
          prevRipples.filter((r) => r.id !== ripple.id)
        );
      }, 1000);
      return acc;
    }, {});

    return () => Object.values(cleanup).forEach(clearTimeout);
  }, [ripples]);

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    const size = Math.max(rect.width, rect.height);

    setRipples([
      ...ripples,
      {
        id: Date.now(),
        left,
        top,
        size,
      },
    ]);
  };

  return (
    <div
      className="relative overflow-hidden"
      onClick={handleClick}
      style={{ isolation: "isolate", width: width }}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: "absolute",
            left: ripple.left - ripple.size / 2,
            top: ripple.top - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            borderRadius: "50%",
            backgroundColor: color,
            animation: "ripple 500ms linear",
            opacity: 0,
          }}
        />
      ))}
      {children}
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AppRipple;

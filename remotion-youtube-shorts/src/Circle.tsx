import React from "react";

interface CircleProps {
  x: number;
  y: number;
  radius: number;
  color: string;
  index: number; // New prop for the index
}

export const Circle: React.FC<CircleProps> = ({
  x,
  y,
  radius,
  color,
  index,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: radius * 0.6,
        fontWeight: "bold",
      }}
    >
      {index}
    </div>
  );
};

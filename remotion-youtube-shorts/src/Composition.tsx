import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  interpolate,
  Img,
  Audio,
} from "remotion";
import { Circle } from "./Circle";
import { Captions } from "./Captions";

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const centerX = 540; // Half of the width
  const centerY = 960; // Half of the height
  const radius = 300; // Radius of the large circle
  const circleRadius = 100; // Radius of each small circle

  // Animation parameters
  const animationDuration = 120; // 4 seconds at 30 fps
  const offset = 600; // Increased to cover the full diameter

  return (
    <AbsoluteFill>
      <Audio src={staticFile("audio.mp3")} />
      <Img
        src={staticFile("church.jpeg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {[...Array(8)].map((_, index) => {
        const angle = (index / 8) * 2 * Math.PI;
        let x = centerX + radius * Math.cos(angle);
        let y = centerY + radius * Math.sin(angle);

        const progress = (frame % animationDuration) / animationDuration;
        const animatedOffset = interpolate(
          progress,
          [0, 0.5, 1],
          [0, offset, 0],
          { extrapolateRight: "clamp" }
        );

        // Define movement for each pair
        switch (index) {
          case 0:
          case 4:
            x += index === 0 ? -animatedOffset : animatedOffset;
            break;
          case 2:
          case 6:
            y += index === 2 ? -animatedOffset : animatedOffset;
            break;
          case 1:
          case 5:
            x +=
              index === 1
                ? -animatedOffset / Math.sqrt(2)
                : animatedOffset / Math.sqrt(2);
            y +=
              index === 1
                ? -animatedOffset / Math.sqrt(2)
                : animatedOffset / Math.sqrt(2);
            break;
          case 3:
          case 7:
            x +=
              index === 3
                ? animatedOffset / Math.sqrt(2)
                : -animatedOffset / Math.sqrt(2);
            y +=
              index === 3
                ? -animatedOffset / Math.sqrt(2)
                : animatedOffset / Math.sqrt(2);
            break;
          default:
            break;
        }

        return (
          <Circle
            key={index}
            x={x}
            y={y}
            radius={circleRadius}
            color={`hsl(${index * 45}, 70%, 50%)`}
            index={index} // Pass the index to the Circle component
          />
        );
      })}
      <Captions /> {/* Add this line to render captions */}
    </AbsoluteFill>
  );
};

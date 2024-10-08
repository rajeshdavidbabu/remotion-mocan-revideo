import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComposition"
        component={MyComposition}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

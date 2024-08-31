import { makeScene2D, Circle, Img, Audio, Rect, Txt } from "@revideo/2d";
import { createRef, waitFor, all, chain, loopFor } from "@revideo/core";
import { easeInOutCubic, map, tween } from "@revideo/core/lib/tweening";
import wordsData from "../../public/words.json";

export default makeScene2D(function* (view) {
  const circles = Array(8)
    .fill(0)
    .map(() => createRef<Circle>());
  const colors = [
    "#e13238",
    "#008000",
    "#7F00FF",
    "#FFFF00",
    "#FF8C00",
    "#00CED1",
    "#FF1493",
    "#1E90FF",
  ];
  const circleData = [
    { start: { x: -300, y: 0 }, end: { x: 300, y: 0 } },
    { start: { x: 0, y: -300 }, end: { x: 0, y: 300 } },
    { start: { x: 300, y: 0 }, end: { x: -300, y: 0 } },
    { start: { x: 0, y: 300 }, end: { x: 0, y: -300 } },
    { start: { x: -212, y: -212 }, end: { x: 212, y: 212 } },
    { start: { x: 212, y: -212 }, end: { x: -212, y: 212 } },
    { start: { x: 212, y: 212 }, end: { x: -212, y: -212 } },
    { start: { x: -212, y: 212 }, end: { x: 212, y: -212 } },
  ];

  view.add(<Img src="/image.jpeg" width={view.width} height={view.height} />);

  view.add(<Audio src="/audio.mp3" play volume={0.5} />);

  circleData.forEach((data, i) => {
    view.add(
      <Circle
        ref={circles[i]}
        x={data.start.x}
        y={data.start.y}
        width={240}
        height={240}
        fill={colors[i]}
      />
    );
  });

  const words = wordsData.results.channels[0].alternatives[0].words;
  const captionRef = createRef<Rect>();
  const wordRef = createRef<Txt>();

  const PHRASE_DURATION = 2; // Duration of each phrase in seconds
  const MAX_WORDS_PER_PHRASE = 7; // Maximum number of words per phrase

  const phrases = [];
  let currentPhrase: any[] = [];
  let phraseStartTime = 0;

  words.forEach((word) => {
    if (
      currentPhrase.length === 0 ||
      (word.end - phraseStartTime <= PHRASE_DURATION &&
        currentPhrase.length < MAX_WORDS_PER_PHRASE)
    ) {
      if (currentPhrase.length === 0) {
        phraseStartTime = word.start;
      }
      currentPhrase.push(word);
    } else {
      phrases.push(currentPhrase);
      currentPhrase = [word];
      phraseStartTime = word.start;
    }
  });

  if (currentPhrase.length > 0) {
    phrases.push(currentPhrase);
  }

  view.add(
    <Rect
      ref={captionRef}
      width={view.width() * 0.8}
      height={200}
      y={-view.height() / 2 + 120}
      fill="#CC000099"
      radius={20}
      padding={40}
    >
      <Txt
        ref={wordRef}
        fontSize={48}
        fill="#ffffff"
        fontWeight={700}
        textAlign="center"
        lineHeight={80}
        fontFamily="Arial"
        shadowColor="#00000080"
        shadowOffset={2}
        shadowBlur={4}
      />
    </Rect>
  );

  // Create a generator function for the circle animations
  function* animateCircles() {
    yield* loopFor(24, function* () {
      yield* chain(
        tween(2, (value) => {
          circles.forEach((circle, i) => {
            const { start, end } = circleData[i];
            circle().position.x(map(start.x, end.x, easeInOutCubic(value)));
            circle().position.y(map(start.y, end.y, easeInOutCubic(value)));
          });
        }),
        tween(2, (value) => {
          circles.forEach((circle, i) => {
            const { start, end } = circleData[i];
            circle().position.x(map(end.x, start.x, easeInOutCubic(value)));
            circle().position.y(map(end.y, start.y, easeInOutCubic(value)));
          });
        })
      );
    });
  }

  // Run circle animations and word display concurrently
  yield* all(
    animateCircles(),
    (function* () {
      for (const phrase of phrases) {
        const phraseText = phrase.map((word) => word.word).join(" ");
        wordRef().text(phraseText);
        yield* waitFor(phrase[phrase.length - 1].end - phrase[0].start);
      }
      // Clear the text after all phrases have been displayed
      wordRef().text("");
    })()
  );
});

import React, { useEffect, useState, useMemo } from "react";
import { useCurrentFrame, useVideoConfig, staticFile } from "remotion";

interface Word {
  word: string;
  start: number;
  end: number;
}

interface WordsData {
  results: {
    channels: Array<{
      alternatives: Array<{
        words: Word[];
      }>;
    }>;
  };
}

const PHRASE_DURATION = 2; // Duration of each phrase in seconds
const MAX_WORDS_PER_PHRASE = 7; // Maximum number of words per phrase

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    fetch(staticFile("words.json"))
      .then((response) => response.json())
      .then((data: WordsData) => {
        setWords(data.results.channels[0].alternatives[0].words);
      });
  }, []);

  const phrases = useMemo(() => {
    const result: Word[][] = [];
    let currentPhrase: Word[] = [];
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
        result.push(currentPhrase);
        currentPhrase = [word];
        phraseStartTime = word.start;
      }
    });

    if (currentPhrase.length > 0) {
      result.push(currentPhrase);
    }

    return result;
  }, [words]);

  const currentTime = frame / fps;

  const visiblePhrase = phrases.find(
    (phrase) =>
      currentTime >= phrase[0].start &&
      currentTime <= phrase[phrase.length - 1].end
  );

  if (!visiblePhrase) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "40px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 0, 0, 0.8)",
          color: "white",
          padding: "20px 40px",
          borderRadius: 20,
          fontSize: 64,
          fontWeight: "bold",
          textAlign: "center",
          maxWidth: "80%",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        {visiblePhrase.map((word) => word.word).join(" ")}
      </div>
    </div>
  );
};

import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";

type vizComponentProps = {
  src: any; // should be a react reference
  options: {};
};

function WaveComponent({ src, options }: vizComponentProps) {
  // Refrences
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const wavizReference = useRef<Waviz | null>(null);
  const isPlaying = useRef(false);
  const source = useRef(src);

  // Use Effect Logic
  useEffect(() => {
    // Check if canvas exists
    if (!canvasReference.current) return;

    if (!wavizReference.current && source.current.current) {
      wavizReference.current = new Waviz(
        canvasReference.current,
        source.current.current
      );
    }

if(src.current instanceof HTMLAudioElement){

  // Start visualizer
  function playWave() {
    if (!isPlaying.current) {
      wavizReference.current.wave(options);
      isPlaying.current = true;
    }
  }

  // Stop visualizer
  function stopWave() {
    if (isPlaying.current) {
      wavizReference.current.visualizer.stop();
      isPlaying.current = false;
    }
  }

  // Event listeners -
  src.current.addEventListener("play", playWave);
  src.current.addEventListener("pause", stopWave);
}else{
  wavizReference.current.wave(options);
}
  }, [src, options, isPlaying]);

  return (
    <div>
      <canvas ref={canvasReference} width={500} height={250}></canvas>
    </div>
  );
}
export default WaveComponent;

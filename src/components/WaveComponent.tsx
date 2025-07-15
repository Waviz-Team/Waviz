import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";

type vizComponentProps = {
  srcAudio: any;
  srcCanvas: React.RefObject<HTMLCanvasElement>;
  options: {};
};

function WaveComponent({ srcAudio, srcCanvas, options }: vizComponentProps) {
  // References
  const wavizReference = useRef<Waviz | null>(null);
  const isPlaying = useRef(false);
  const canvasRef = useRef(null);

  // Use Effect Logic
  useEffect(() => {
    //Check if canvas is passed in
    if (srcCanvas) {
      canvasRef.current = srcCanvas.current;
    }

    // Check if canvas exists
    if (!canvasRef.current) return;

    if (!wavizReference.current && srcAudio.current && canvasRef.current) {
      wavizReference.current = new Waviz(canvasRef.current, srcAudio.current);
    }

    if (srcAudio.current instanceof HTMLAudioElement) {
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
      srcAudio.current.addEventListener("play", playWave);
      srcAudio.current.addEventListener("pause", stopWave);
    } else {
      wavizReference.current.wave(options);
    }
  }, [srcAudio,srcCanvas, options, isPlaying, ]);

  return (
    <div>
      {!srcCanvas && <canvas ref={canvasRef} width={500} height={300}></canvas>}
      {true && canvasRef.current}
    </div>
  );
}
export default WaveComponent;

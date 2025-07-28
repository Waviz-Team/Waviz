import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";

// User props: ['color', num: # of bars]
type vizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {}; // Expects ['color', numBars]
  audioContext?: AudioContext;
};

function Bar1v({ srcAudio, srcCanvas, options, audioContext }: vizComponentProps) {
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // Convert user options into internal format
  let userOptions = {};
  if (options) {
    userOptions = {
      color: [options[0]],        // bar color (neon-style preferred like '#00ffff')
      viz: ["bars", options[1]], // 'bars' visualization with number of bars
      glow: [true],              // enable glow effect
    };
  }

  // Default fallback options
  const defaults = {
    viz: ["bars", 12],      // 12 bars by default
    stroke: [30],           // stroke width
    color: ["#00ffff"],     // default neon blue
    glow: [true],           // neon glow enabled by default
  };

  const optionsObject = Object.assign({}, defaults, userOptions);

  // Prepare canvas
  useEffect(() => {
    if (srcCanvas?.current) {
      canvasRef.current = srcCanvas.current;
      setCanvasReady(true);
    } else if (canvasRef.current) {
      setCanvasReady(true);
    }
  }, [srcCanvas]);

  // Initialize Waviz and attach play/pause listeners
  useEffect(() => {
    if (!canvasReady || !canvasRef.current || !srcAudio.current) return;

    if (!wavizReference.current) {
      wavizReference.current = new Waviz(canvasRef.current, srcAudio.current, audioContext);
    }

    if (srcAudio.current instanceof HTMLAudioElement) {
      const playWave = () => wavizReference.current?.render(optionsObject);
      const stopWave = () => wavizReference.current?.visualizer.stop();

      srcAudio.current.addEventListener("play", playWave);
      srcAudio.current.addEventListener("pause", stopWave);

      return () => {
        srcAudio.current.removeEventListener("play", playWave);
        srcAudio.current.removeEventListener("pause", stopWave);
        wavizReference.current?.visualizer.stop();
      };
    } else {
      wavizReference.current.render();
    }
  }, [canvasReady, srcAudio, options, audioContext]);

  return (
    <div>
      {!srcCanvas && <canvas ref={canvasRef} width={600} height={350}></canvas>}
    </div>
  );
}

export default Bar1v;

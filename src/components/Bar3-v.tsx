import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";

// User props: ['color', num: # of bars]
type vizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {};
  audioContext?: AudioContext;
};

function Bar3v({ srcAudio, srcCanvas, options, audioContext }: vizComponentProps) {
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // Convert user options into visualization config
  let userOptions = {};
  if (options) {
    userOptions = {
      color: [options[0]],          // glow color
      viz: ["bars", options[1]],   // base type is 'bars', enhanced by glow/pulse
      glow: [true],                // enable glow effect
      alpha: [0.6],                // bar transparency for soft light
      pulse: [true],               // subtle pulsing animation
    };
  }

  const defaults = {
    viz: ["bars", 20],  // default bar count
    stroke: [30],       // base stroke width
    glow: [true],       // glow by default
  };

  const optionsObject = Object.assign(defaults, userOptions);

  // Canvas setup
  useEffect(() => {
    if (srcCanvas?.current) {
      canvasRef.current = srcCanvas.current;
      setCanvasReady(true);
    } else if (canvasRef.current) {
      setCanvasReady(true);
    }
  }, [srcCanvas]);

  // Visualizer render logic
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
      {!srcCanvas && <canvas ref={canvasRef} width={500} height={300}></canvas>}
    </div>
  );
}

export default Bar3v;

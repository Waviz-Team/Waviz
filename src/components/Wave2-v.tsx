import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";

// Galaxy-style curved waveform with amplified amplitude
type VizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {}; // Expected: ['color', resolution, amplitudeScale]
  audioContext?: AudioContext;
};

function Wave2v({ srcAudio, srcCanvas, options, audioContext }: VizComponentProps) {
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // Handle user options
  let userOptions = {};
  if (options && Array.isArray(options)) {
    userOptions = {
      color: [options[0]],                          // color
      domain: ['time', options[1] || 1024],        // frequency
      style: ['line'],                             // waveform
      glow: [true],
      amplitudeScale: [options[2] || 2.0],         // amplitude
    };
  }

  const defaults = {
    domain: ['time', 1024],
    style: ['line'],
    color: ['#00ffff'],
    glow: [true],
    amplitudeScale: [2.0],  // 
  };

  const optionsObject = Object.assign({}, defaults, userOptions);

  // Set canvas ref
  useEffect(() => {
    if (srcCanvas?.current) {
      canvasRef.current = srcCanvas.current;
      setCanvasReady(true);
    } else if (canvasRef.current) {
      setCanvasReady(true);
    }
  }, [srcCanvas]);

  // Visualization logic
  useEffect(() => {
    if (!canvasReady || !canvasRef.current || !srcAudio.current) return;

    if (!wavizReference.current) {
      wavizReference.current = new Waviz(canvasRef.current, srcAudio.current, audioContext);
    }

    if (srcAudio.current instanceof HTMLAudioElement) {
      const playViz = () => wavizReference.current?.render(optionsObject);
      const stopViz = () => wavizReference.current?.visualizer.stop();

      srcAudio.current.addEventListener("play", playViz);
      srcAudio.current.addEventListener("pause", stopViz);

      return () => {
        srcAudio.current.removeEventListener("play", playViz);
        srcAudio.current.removeEventListener("pause", stopViz);
        wavizReference.current?.visualizer.stop();
      };
    } else {
      wavizReference.current.render(optionsObject);
    }
  }, [canvasReady, srcAudio, options, audioContext]);

  return (
    <div>
      {!srcCanvas && <canvas ref={canvasRef} width={500} height={300}></canvas>}
    </div>
  );
}

export default Wave2v;

import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";

// User props: ['color', numBars]
type vizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {}; // ['color', number of bars]
  audioContext?: AudioContext;
};

function Bar2v({ srcAudio, srcCanvas, options, audioContext }: vizComponentProps) {
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // Process user options
  let userOptions = {};
  if (options) {
    userOptions = {
      color: [options[0]],        // bar color
      viz: ["bars", options[1]], // 'bars' visualization with count
      mirror: [true],            // mirror effect for symmetry
      spacing: [3],              // tighter spacing
    };
  }

  // Default values
  const defaults = {
    viz: ["bars", 14],
    stroke: [15],                // thinner bars for subset look
    color: ["#dda0dd"],          // soft purple
    mirror: [true],
    spacing: [3],
    margin: [50],                // add side margin for subset layout
  };

  const optionsObject = Object.assign({}, defaults, userOptions);

  useEffect(() => {
    if (srcCanvas?.current) {
      canvasRef.current = srcCanvas.current;
      setCanvasReady(true);
    } else if (canvasRef.current) {
      setCanvasReady(true);
    }
  }, [srcCanvas]);

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
      {!srcCanvas && <canvas ref={canvasRef} width={600} height={300}></canvas>}
    </div>
  );
}

export default Bar2v;

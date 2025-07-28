import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";

//* User props: ['color', number]

type VizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {};
  audioContext?: AudioContext;
};

function Wave1v({ srcAudio, srcCanvas, options, audioContext }: VizComponentProps) {
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // Handle user options
  let userOptions = {};
  if (options && Array.isArray(options)) {
    userOptions = {
      color: [options[0]],
      domain: ['time', options[1]],
    };
  }

  const defaults = {};
  const optionsObject = Object.assign(defaults, userOptions);

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
      wavizReference.current.render();
    }
  }, [canvasReady, srcAudio, options, audioContext]);

  return (
    <div>
      {!srcCanvas && <canvas ref={canvasRef} width={500} height={300}></canvas>}
    </div>
  );
}

export default Wave1v;

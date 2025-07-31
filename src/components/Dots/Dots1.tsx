import React, { useRef, useEffect, useState } from 'react';
import Waviz from '../../core/waviz';
//* Simple dots visualizer, customizable color and dot count.
//* Props: Color, Number of dots


type VizComponentProps = {
  srcAudio: React.RefObject<HTMLAudioElement | null>;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: object;
  audioContext?: AudioContext;
};

function Dots1({
  srcAudio,
  srcCanvas,
  options,
  audioContext,
}: VizComponentProps) {
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // User-provided options
  let userOptions = {};
  if (options && Array.isArray(options)) {
    userOptions = {
      viz: ['dots', options[1]], // or try "dots", "polarBars", etc.
      color: [options[0]], // e.g., '#ff00ff' or gradient string
      stroke: [6], // thicker stroke for flashy style
    };
  }

  // Default fallback options
  const defaults = {
    domain: ['time', 200],
    viz: ['dots', 32],
    color: ['#ff00ff'], // vibrant pink
    stroke: [4],
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
      wavizReference.current = new Waviz(
        canvasRef.current,
        srcAudio.current,
        audioContext
      );
    }

    if (srcAudio.current instanceof HTMLAudioElement) {
      const playViz = () => wavizReference.current?.render(optionsObject);
      const stopViz = () => wavizReference.current?.visualizer.stop();

      srcAudio.current.addEventListener('play', playViz);
      srcAudio.current.addEventListener('pause', stopViz);

      return () => {
        srcAudio.current.removeEventListener('play', playViz);
        srcAudio.current.removeEventListener('pause', stopViz);
        wavizReference.current?.visualizer.stop();
      };
    } else {
      wavizReference.current.render(optionsObject);
    }
  }, [canvasReady, srcAudio, options, audioContext]);

  return (
    <div>
      {!srcCanvas && (
        <canvas
          ref={canvasRef}
          width={600}
          height={350}
          style={{ backgroundColor: 'black', borderRadius: '8px' }}></canvas>
      )}
    </div>
  );
}

export default Dots1;

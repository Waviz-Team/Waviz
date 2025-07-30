import React, { useRef, useEffect, useState } from 'react';
import Waviz from '../../core/waviz';
//* User props: ['color', num: # of bars]

type vizComponentProps = {
  srcAudio: React.RefObject<HTMLAudioElement>;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {};
  audioContext?: AudioContext;
};

function Mixed4({
  srcAudio,
  srcCanvas,
  options,
  audioContext,
}: vizComponentProps) {
  // References
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered

  let userOptions = {};
  if (options) {
    userOptions = [
      { color: ['linearGradient', options[0], options[1]] },
      { color: ['linearGradient', options[0], options[1]] },
      { color: ['linearGradient', options[0], options[1]] },
    ];
  }

  const defaults = [
    {
      domain: ['time', 400],
      coord: ['polar', 100],
      viz: ['bars', 64],
      color: ['radialGradient', '#70044aff', '#f84791ff', 100, 120],
      stroke: [6],
    },
    {
      domain: ['time', 300],
      coord: ['polar', 100],
      viz: ['line'],
      color: ['radialGradient', '#003bdcff', '#1893B8', 100, 150],
      stroke: [4],
    },
    {
      domain: ['time', 250],
      coord: ['polar', 0, 0, 0.1], // center particles with slight auto-rotation
      viz: ['particles', [3, 3], 0, 35, 5, 50],
      color: ['radialGradient', '#002f41ff', '#02bff8ff', 10, 50],
      stroke: [1],
    },
  ];
  const optionsObject = [
    Object.assign({}, defaults[0], userOptions[0]),
    Object.assign({}, defaults[1], userOptions[1]),
    Object.assign({}, defaults[2], userOptions[2]),
  ];

  // Use Effect Logic
  useEffect(() => {
    //Check if canvas is passed in and assign srcCanvas to canvasRef if passed in
    if (srcCanvas?.current) {
      //! Logic shortened with ? operator to throw undefined instead of of error
      canvasRef.current = srcCanvas.current;
      setCanvasReady(true);
    } else if (canvasRef.current) {
      setCanvasReady(true);
    }
  }, [srcCanvas]);

  useEffect(() => {
    // Check if canvas exists
    if (!canvasReady || !canvasRef.current || !srcAudio.current) return;

    if (!wavizReference.current) {
      wavizReference.current = new Waviz(
        canvasRef.current,
        srcAudio.current,
        audioContext
      );
    }

    if (srcAudio.current instanceof HTMLAudioElement) {
      const playWave = () => wavizReference.current?.render(optionsObject);
      const stopWave = () => wavizReference.current?.visualizer.stop();

      // Event Listeners
      srcAudio.current.addEventListener('play', playWave);
      srcAudio.current.addEventListener('pause', stopWave);

      return () => {
        // Cleanup Listeners
        srcAudio.current.removeEventListener('play', playWave);
        srcAudio.current.removeEventListener('pause', stopWave);
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
export default Mixed4;

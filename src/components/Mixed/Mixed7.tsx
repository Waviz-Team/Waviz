import React, { useRef, useEffect, useState } from 'react';
import Waviz from '../../core/waviz';
//* Particles and lines with a linear gradient and "flip" effect.
//* Props: Color1, Color2

type vizComponentProps = {
  srcAudio: React.RefObject<HTMLAudioElement | null>;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: object;
  audioContext?: AudioContext;
};

function Mixed7({
  srcAudio,
  srcCanvas,
  options,
  audioContext,
}: vizComponentProps) {
  // References
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendeteal

  // User options
  let userOptions = {};
  if (options) {
    userOptions = [
      {
        color: ['linearGradient', options[0], options[1], 'flip'],
      },
      {
        color: [options[0]],
      },
    ];
  }

  const defaults = [
    {
      domain: ['time', 300, 100],
      coord: ['rect', 100],
      viz: ['particles', [1, 3], 0.1, undefined, 6, 40],
      color: ['linearGradient', 'white', 'teal', 'flip'],
      stroke: [2],
    },
    {
      domain: ['time', 300, 100],
      coord: ['rect', 100],
      viz: ['line'],
      color: ['snow'],
      stroke: [3],
    },
  ];
  const optionsObject = [
    Object.assign(defaults[0], userOptions[0]),
    Object.assign(defaults[1], userOptions[1]),
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
export default Mixed7;

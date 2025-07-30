import React, { useRef, useEffect, useState } from 'react';
import Waviz from '../../core/waviz';

//* User props: ['color', number]

type vizComponentProps = {
  srcAudio: React.RefObject<HTMLAudioElement>;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: object;
  audioContext?: AudioContext;
};

function Mixed8({
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
      { color: ['linearGradient', options[0], options[1]] },
      { color: ['linearGradient', options[0], options[1]] },
    ];
  }

  const defaults = [
    {
      domain: ['time', 500],
      color: ['linearGradient', '#00FFFF', '#8A2BE2'],
      stroke: [5],
    },
    {
      domain: ['time', 400],
      color: ['linearGradient', '#20B2AA', '#8A2BE2'],
      stroke: [4],
    },
    {
      domain: ['time', 300],
      color: ['linearGradient', '#7FFFD4', '#6A5ACD'],
      stroke: [3],
    },
    {
      domain: ['time', 400],
      viz: ['particles', [1, 1], 0.02, 30, 5, 40], // velocity, gravity, lifespan, birthrate, samples
      color: ['linearGradient', '#7FFFD4', '#00FFFF'],
      stroke: [2],
    },
    {
      domain: ['time', 400],
      viz: ['particles', [1, 1], -0.02, 30, 5, 40], // velocity, gravity, lifespan, birthrate, samples
      color: ['linearGradient', '#7FFFD4'],
      stroke: [2],
    },
  ];

  const optionsObject = [
    Object.assign(defaults[0], userOptions[0]),
    Object.assign(defaults[1], userOptions[1]),
    Object.assign(defaults[2], userOptions[2]),
    Object.assign(defaults[3], userOptions[3]),
    Object.assign(defaults[4], userOptions[4]),
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
export default Mixed8;

import React, { useRef, useEffect, useState } from 'react';
import Waviz from '../core/waviz';
//* User props: ['color', num: # of bars]

type vizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {};
  audioContext?: AudioContext;
};

function Bar1({
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
    userOptions = {
      domain: ['freq', -200, 100],
      viz: ['bars', 12],
      color: ['linearGradient', options[0], options[1], 'flip'],
      stroke: [50, 'dashes'],
    };
  }

  const defaults = {
    domain: ['freq', -200, 100],
    viz: ['bars', 12],
    color: ['linearGradient', '#0088ffff', '#00ffd5ff', 'flip'],
    stroke: [50, 'dashes'],
  };

  const optionsObject = Object.assign(defaults, userOptions);

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
      wavizReference.current.render();
    }
  }, [canvasReady, srcAudio, options, audioContext]);

  return (
    <div>
      {!srcCanvas && <canvas ref={canvasRef} width={500} height={300}></canvas>}
    </div>
  );
}
export default Bar1;

import React, { useRef, useEffect, useState } from 'react';
import Waviz from '../core/waviz';

//* User props: ['color', number]

type vizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {};
  audioContext?: AudioContext;
};

function Wave1({
  srcAudio,
  srcCanvas,
  options,
  audioContext,
}: vizComponentProps) {
  // References
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered

  // User options
  let userOptions = {};
  if (options) {
    userOptions = [
      {
        domain: ['time', 300, 512],
        color: [options],
      },
      { domain: ['time', 600], color: ['ghostwhite'] },
    ];
  }

  const defaults = [
    {
      domain: ['time', 300, 512],
      color: ['#7afff2ff'],
    },
    { domain: ['time', 600], viz: ['dots'], color: ['#e5fffbff'] },
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
      wavizReference.current.render();
    }
  }, [canvasReady, srcAudio, options, audioContext]);

  return (
    <div>
      {!srcCanvas && <canvas ref={canvasRef} width={500} height={300}></canvas>}
    </div>
  );
}
export default Wave1;

import React, { useRef, useEffect, useState } from 'react';
import Waviz from '../../core/waviz';

type VizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {};
  audioContext?: AudioContext;
};

function Dots2({
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
    userOptions = [
      { color: ['linearGradient', options[0], options[1]] },
      { color: ['linearGradient', options[0], options[1]] },
      { color: ['linearGradient', options[0], options[1]] },
      { color: ['linearGradient', options[0], options[1]] },
      { color: ['linearGradient', options[0], options[1]] },
    ];
  }

  // Default fallback options
  const defaults = [
    {
      domain: ['time'],
      coord: ['rect'],
      viz: ['dots'],
      color: ['linearGradient'],
      stroke: [2],
    },
    {
      domain: ['time', 200],
      coord: ['rect'],
      viz: ['dots'],
      color: ['linearGradient'],
      stroke: [2],
    },
    {
      domain: ['time', 300],
      coord: ['rect'],
      viz: ['dots'],
      color: ['linearGradient'],
      stroke: [2],
    },
    {
      domain: ['time', 400],
      coord: ['rect'],
      viz: ['dots'],
      color: ['linearGradient'],
      stroke: [2],
    },
    {
      domain: ['time', 500],
      coord: ['rect'],
      viz: ['dots'],
      color: ['linearGradient'],
      stroke: [2],
    },
  ];

  const optionsObject = [
    Object.assign({}, defaults[0], userOptions[0]),
    Object.assign({}, defaults[1], userOptions[1]),
    Object.assign({}, defaults[2], userOptions[2]),
    Object.assign({}, defaults[3], userOptions[3]),
    Object.assign({}, defaults[4], userOptions[4]),
  ];

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

export default Dots2;

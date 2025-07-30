import React, { useRef, useEffect, useState } from 'react';
import Waviz from '../../core/waviz';
import {
  getCSSColor,
  rgbToHsl,
  hexToRgb,
  rgbToArray,
  HSLtoArray,
} from '../../utils/colorUtils';

//* User props: ['color', number]

type vizComponentProps = {
  srcAudio: React.RefObject<HTMLAudioElement | null>;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: object;
  audioContext?: AudioContext;
};

function Wave7({
  srcAudio,
  srcCanvas,
  options,
  audioContext
}: vizComponentProps) {
  // References
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered

  const userOptions = {};
  // if(options){
  //   userOptions = {color}
  // }

  const defaults = [
    { domain: ['time', 400], coord: ['polar', 100], color: ['#eb1b00ff'] },
    { domain: ['time', 350], coord: ['polar', 100], color: ['#eb4300ff'] },
    { domain: ['time', 300], coord: ['polar', 100], color: ['#ff6715ff'] },
    { domain: ['time', 250], coord: ['polar', 100], color: ['#ff9320ff'] },
    { domain: ['time', 200], coord: ['polar', 100], color: ['#ffb836ff'] },
    { domain: ['time', 150], coord: ['polar', 100], color: ['#ffca68ff'] },
    { domain: ['time', 100], coord: ['polar', 100], color: ['#ffdd9dff'] },
    { domain: ['time', 50], coord: ['polar', 100], color: ['#ffeeceff'] },
  ];

  defaults.forEach((e, i) => {
    if (!options || typeof options !== 'string') {
      return;
    } else {
      let hsl;

      if (options.includes('rgb')) {
        const rgb = rgbToArray(options);
        hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      } else if (options.includes('hsl')) {
        hsl = HSLtoArray(options);
      } else if (options.includes('#')) {
        const rgb = hexToRgb(options);
        hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      } else {
        const hex = getCSSColor(options);
        const rgb = hexToRgb(hex);
        hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      }

      e.color[0] = `hsl(${hsl[0] + i * 10},${hsl[1] / ((i + 1) / 2)}%,${
        hsl[2]
      }%)`;
    }
  });

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
      wavizReference.current.render(optionsObject);
    }
  }, [canvasReady, srcAudio, options, audioContext]);

  return (
    <div>
      {!srcCanvas && <canvas ref={canvasRef} width={500} height={300}></canvas>}
    </div>
  );
}
export default Wave7;

import React, { useRef, useEffect, useState } from "react";
import Waviz from "../../core/waviz";
//* Desc: Simple Bars using freq (fft) and the first 300 bins/samples
//* User props: ['color', number: bars]

type vizComponentProps = {
  srcAudio: React.RefObject<HTMLAudioElement>;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {};
  audioContext?: AudioContext;
};

function Bar6({ srcAudio, srcCanvas, options, audioContext }: vizComponentProps) {
  // References
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
  
  let userOptions = {}
  if(options){
    userOptions = {color: options[0], viz: ['bars', options[1]]}
  }
  
  const defaults={domain:['freq', -200, 300], viz:['bars', 11], coord: ['rect'], color: ['#E93EB7'], stroke: [25]}
  const optionsObject = Object.assign(defaults, userOptions)

  // Use Effect Logic
 useEffect(() => { //Check if canvas is passed in and assign srcCanvas to canvasRef if passed in
    if (srcCanvas?.current) { //! Logic shortened with ? operator to throw undefined instead of of error
      canvasRef.current = srcCanvas.current
      setCanvasReady(true);
    } else if (canvasRef.current) {
      setCanvasReady(true);
    }
 }, [srcCanvas])
  
  useEffect(() => {
    // Check if canvas exists
    if (!canvasReady || !canvasRef.current || !srcAudio.current) return;

    if (!wavizReference.current) {
      wavizReference.current = new Waviz(canvasRef.current, srcAudio.current, audioContext);
    }

    if (srcAudio.current instanceof HTMLAudioElement) {
      const playWave = () => wavizReference.current?.render(optionsObject);
      const stopWave = () => wavizReference.current?.visualizer.stop();
      
      // Event Listeners
      srcAudio.current.addEventListener("play", playWave);
      srcAudio.current.addEventListener("pause", stopWave);

      return () => { // Cleanup Listeners
        srcAudio.current.removeEventListener("play", playWave);
        srcAudio.current.removeEventListener("pause", stopWave);
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
export default Bar6;

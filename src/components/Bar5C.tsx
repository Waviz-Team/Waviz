

import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";
//* User props: ['color', num: # of bars]

type vizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {};
  audioContext?: AudioContext;
};

function Bar5C({ srcAudio, srcCanvas, options, audioContext }: vizComponentProps) {
  // References
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
  
  let userOptions = {}
  if(options){
    userOptions = {color:[options[0]], viz:['bars', options[1]]}
  }
  
 const defaults = [
  {
    domain: ['time', 500],
    coord: ['polar', 100],         
    viz: ['bars', 64],             
    color: ['linearGradient', '#B50E7A', '#C41A62'],
    stroke: [6],
  },
  {
    domain: ['time', 500],
    coord: ['polar', 100], 
    viz: ['line'],
    color: ['linearGradient', '#1A97C4', '#1893B8'],
    stroke: [4],
  },
  {
    domain: ['time', 250],
    coord: ['polar', 0, 0, 0.1],   // center particles with slight auto-rotation
    viz: ['particles', [1, 1], 0, 200, 4, 80], 
    color: ['randomPalette', ['#ffffff', '#ff00cc', '#00ffff', '#f5f5f5', '#99ccff']],
    stroke: [0.7],
  },
];
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
      wavizReference.current.render();
    }
  }, [canvasReady, srcAudio, options, audioContext]);

  return (
    <div>
      {!srcCanvas && <canvas ref={canvasRef} width={500} height={300}></canvas>}
    </div>
  );
}
export default Bar5C;











import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";
//* User props: ['color', num: # of bars]

type vizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {};
  audioContext?: AudioContext;
};

function Bar2Cate({ srcAudio, srcCanvas, options, audioContext }: vizComponentProps) {
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
    domain: ['freq', 200],              
    coord: ['polar', 120],    
    viz: ['bars', 200],                
    color: ['randomPalette', ['#00BFFF', '#40E0D0', '#5AC8FA','#0096FF', 
]],
    stroke: [2, 'dashes'],           
    
  }, 
  {
    domain: ['time', 100],              
    coord: ['polar'],                     
    viz: ['particles',[1, 1], 0, 90, 3, 100],                 
    color: ['randomPalette', ['#00BCD4', '#3F51B5', '#8E24AA', '#E91E63']], 
    stroke: [2],
  },
  // {
  //   domain: ['time', 300],              
  //   coord: ['rect'],                     
  //   viz: ['bars'], 
  //   color: ['randomPalette', '#3F51B5', '#00BCD4', '#8E24AA'], 
  //   stroke: [3],
  // }
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
export default Bar2Cate;
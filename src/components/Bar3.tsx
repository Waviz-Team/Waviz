import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";
//* User props: ['color', num: # of bars]

type vizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {};
  audioContext?: AudioContext;
};

function Bar3({ srcAudio, srcCanvas, options, audioContext }: vizComponentProps) {
  // References
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
  
  let userOptions = {}
  if(options){
    userOptions = {color:[options[0]], viz:['bars', options[1]]}
  }
  
 const defaults = [{
  domain: ['time', 300],              
  coord: ['rect'],                    
  viz: ['bars', 20],                   
  color: ['linearGradient', '#00bcd4', '#3f51b5'], 
  stroke: [18],                        
}, 
{
  domain: ['time', 500],              
  coord: ['rect'],                     
  viz: ['particles', [1, 1], 0.2, 100, 2, 100],                   
  color: ['linearGradient', '#00bcd4', '#6D109C'], 
  stroke: [3],                        
},
{
  // domain: ['time', 20],              
  // coord: ['rect'],                    
  // viz: ['bars', 20],                   
  // color: ['linearGradient', '#10539C', '#7F1B8F'], 
  // stroke: [16],                        
}, ];
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
export default Bar3;
import React, { useRef, useEffect, useState } from "react";
import Waviz from "../../core/waviz";
//* User props: ['color', num: # of bars]

type vizComponentProps = {
  srcAudio: React.RefObject<HTMLAudioElement>;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: object;
  audioContext?: AudioContext;
};

function Mixed5({ srcAudio, srcCanvas, options, audioContext }: vizComponentProps) {
  // References
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
  
  let userOptions = {}
  if(options){
    userOptions = {color:[options[0]], viz:['bars', options[1]]}
  }
  
 const defaults = [{
  domain: ['time', 400],              
  coord: ['polar', 90],                    
  viz: ['bars', 30],                   
  color: ['randomPalette', ['#57BBDE', '#9DDE57', '#CC57DE', '#DE9C57', '#FDB813']], 
  stroke: [10],                        
}, 
{
    domain: ['time', 300],              
    coord: ['rect'],                     
    viz: ['dots', 300],                   
    color: ['randomPalette', ['#57BBDE', '#9DDE57', '#CC57DE', '#DE9C57', '#FDB813']], 
    stroke: [3],                        
  },
    {
    domain: ['freq', 400],
    coord: ['polar', 140],   
    viz: ['particles', [1, 1], 0.2, 200, 6, 80], 
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
      wavizReference.current.render(optionsObject);
    }
  }, [canvasReady, srcAudio, options, audioContext]);

  return (
    <div>
      {!srcCanvas && <canvas ref={canvasRef} width={500} height={300}></canvas>}
    </div>
  );
}
export default Mixed5;
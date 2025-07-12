import React, { useRef, useEffect } from 'react';
// import Input from '../input/input';
// import AudioAnalyzer from '../analysers/analyzer';
// import Visualizer from '../visualizers/Visualizer';
import Waviz from '../primary/waviz';

export function vizComponent((audio)) {
  // refrence to canvas and audio Dom elem
  const canvasReference = useRef<HTMLCanvasElement>(null)
  const audioReference = useRef<HTMLCanvasElement>(null)
  // referecen to nodes + class instancess
  const wavizClassReference = useRef<Waviz | null>(null)

  useEffect (() => {
  if (!canvasReference.current || !audioReference.current) return; 
  const waviz = new Waviz (canvasReference.current, audioReference.current);

  const userViz = () => {
    waviz.visualizer.wave()
   

  }
    
  }, [])
}




return (
 <div>
   <canvas ref={canvasReference} width ={} height ={} etc={}> </canvas>
   <audio ref={audioReference} src =".mp3 " > </audio>
 </div>

)


import React, { useRef, useEffect } from 'react';
import Waviz from '../primary/waviz';


type vizComponentProps = {
  src: string;
  lineWidth?: number;
  lineColor?: string;
  multipliyer?: number;
};
 function PlugPlayComponent({
  src,
  lineWidth = 2,
  lineColor = 'orange',
  multipliyer = 1,
}: vizComponentProps) {
  // refrence to canvas and audio Dom elem
  const canvasReference = useRef<HTMLCanvasElement>(null)
  const audioReference = useRef<HTMLAudioElement>(null)
  // referecen to nodes + class instancess
  const wavizClassReference = useRef<Waviz | null>(null)

  useEffect (() => {
  if (!canvasReference.current || !audioReference.current) return; 
  const waviz = new Waviz (canvasReference.current, audioReference.current);
  wavizClassReference.current = waviz
  console.log('Visualizer.wave:', typeof waviz.visualizer.wave);


  const playWave = () => {
    waviz.visualizer.wave({ lineWidth, lineColor, multipliyer })
    console.log(waviz.audioAnalyzer.getFrequencyData())
  }
    
  const pauseWave = () => {
    waviz.visualizer.stop();
    };

  const audio = audioReference.current;
  audio.addEventListener('play', playWave);
  audio.addEventListener('pause', pauseWave);

  return ()=>{
    audio.removeEventListener('play', playWave);
    audio.removeEventListener('pause', pauseWave);
    waviz.visualizer.stop();
  }

  }, [src, lineWidth, lineColor, multipliyer])
  



  


return (
 <div>
   <canvas ref={canvasReference} width ={800} height ={200}> </canvas>
   <audio ref={audioReference} src={src} controls crossOrigin="anonymous"> </audio>
 </div>

)
}
export default PlugPlayComponent




//----

    // import React, { useRef, useEffect } from 'react';

    // function MyCanvasComponent({ data }) {
    //   const canvasRef = useRef(null);

    //   useEffect(() => {
    //     const canvas = canvasRef.current;
    //     const ctx = canvas.getContext('2d');

    //     // Clear the canvas before drawing new content
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);

    //     // Draw your content based on the 'data' prop or component state
    //     // For example:
    //     ctx.fillStyle = 'blue';
    //     ctx.fillRect(0, 0, 100, 100);
    //     // ... more drawing operations based on 'data'
    //   }, [data]); // Re-run effect when 'data' changes

    //   return <canvas ref={canvasRef} width={400} height={300} />;
    // }

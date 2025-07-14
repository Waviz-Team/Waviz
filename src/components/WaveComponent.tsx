import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";

type vizComponentProps = {
  src: any; // should be a react reference
  options: {};
};

function WaveComponent({ src, options }: vizComponentProps) {

  // refrence to canvas and audio Dom elem
  const canvasReference = useRef<HTMLCanvasElement>(null);
  

  // referece to nodes + class instancess
  const wavizReference = useRef<Waviz | null>(null);

  // 
  const source = useRef(src);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    if (!canvasReference.current) return;

    if (!wavizReference.current && source.current) {
      wavizReference.current = new Waviz(
        canvasReference.current,
        source.current.current
      );
    }

    wavizReference.current.input.initializePending();
    wavizReference.current.visualizer.wave(options);

  //   const playWave = () => {
  //   wavizReference.current.input.initializePending();
  //   wavizReference.current.visualizer.wave(options);
  // };

  // const pauseWave = () => {
  //   wavizReference.current.visualizer.stop();
  // };

  // if(source.current){
  //   const audio = source.current;
  //   audio.addEventListener('play', playWave);
  //   audio.addEventListener('pause', pauseWave);
  // }

  // return () => {
  //   audio.removeEventListener('play', playWave);
  //   audio.removeEventListener('pause', pauseWave);
  //   wavizReference.current.visualizer.stop();
  // };
},[src, options]);






    // wavizReference.current.input.initializePending();
    // wavizReference.current.visualizer.wave(options);
    
    // if(isPlaying) {
    //   wavizReference.current.input.initializePending();
    //   wavizReference.current.visualizer.wave(options);
    // } else {
    //    wavizReference.current.visualizer.stop();
    // }
    //  return () => {
    //   wavizReference.current.visualizer.stop();
    //  }
  // }, [isPlaying, options]);

    // useEffect(()=>{
    //   if(src.current){
    //     setIsPlaying(true)
    //   }
    //   if(!src.current){
    //     setIsPlaying(false)
    //   }
    // })




  return (
    <div className="content">
      <canvas ref={canvasReference} width={500} height={250}></canvas>
    </div>
  );
}
export default WaveComponent;


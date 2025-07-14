import React, { useRef, useEffect, useState } from 'react';
import Waviz from '../primary/waviz';

type vizComponentProps = {
  src: any;
  // inputType?: 'file' | 'microphone';
  lineWidth?: number;
  lineColor?: string;
  multiplier?: number;
};

function WaveComponent({
  src,
  lineWidth = 2,
  lineColor = 'orange',
  multiplier = 1,
}: vizComponentProps) {
  // refrence to canvas and audio Dom elem
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const audioReference = useRef<HTMLAudioElement>(null);
  // referece to nodes + class instancess
  const wavizReference = useRef<Waviz | null>(null);
  const source = useRef(src)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    console.log("source in wave",src)
    if (!canvasReference.current && !audioReference.current) return;
    if(!wavizReference.current){ 
    wavizReference.current = new Waviz(
      canvasReference.current,
      source.current
    )};
    
wavizReference.current.input.initializePending();
      wavizReference.current.visualizer.wave()
    // if(isPlaying) {
    //   wavizReference.current.input.initializePending();
    //   wavizReference.current.visualizer.wave({
    //     lineWidth,
    //     lineColor,
    //     multiplier,
    //   });
    // } else {
    //    wavizReference.current.visualizer.stop();
    // }
  //  return () => {
  //   wavizReference.current.visualizer.stop();
  //  }
    } , [isPlaying, lineWidth, lineColor, multiplier])
  


  return (
    <div className='content'>
      <canvas ref={canvasReference} width={500} height={250}></canvas>
      {/* <audio ref={audioReference} src={src} controls crossOrigin='anonymous' onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}></audio> */}
    </div>
  );
}
export default WaveComponent;




 //   const playWave = async () => {
  //    await wavizReference.current.input.initializePending();
  //     wavizReference.current.visualizer.wave({
  //       lineWidth,
  //       lineColor,
  //       multiplier,
  //     });
  //   };

  //   const pauseWave = () => {
  //     wavizReference.current.visualizer.stop();
  //   };

  //   const audio = audioReference.current;
  //   audio.addEventListener('play', playWave);
  //   audio.addEventListener('pause', pauseWave);

  //   return () => {
  //     audio.removeEventListener('play', playWave);
  //     audio.removeEventListener('pause', pauseWave);
  //     wavizReference.current.visualizer.stop();
  //   };
  // }, [src, lineWidth, lineColor, multiplier]);
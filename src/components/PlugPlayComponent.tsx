import React, { useRef, useEffect } from 'react';
import Waviz from '../core/waviz';

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
  const canvasReference = useRef<HTMLCanvasElement>(null);
  const audioReference = useRef<HTMLAudioElement>(null);
  // referece to nodes + class instancess
  const wavizReference = useRef<Waviz | null>(null);

  useEffect(() => {
    if (!canvasReference.current || !audioReference.current) return;
    wavizReference.current = new Waviz(
      canvasReference.current,
      audioReference.current
    );

    const playWave = () => {
      wavizReference.current.visualizer.wave({
        lineWidth,
        lineColor,
        multipliyer,
      });
    };

    const pauseWave = () => {
      wavizReference.current.visualizer.stop();
    };

    const audio = audioReference.current;
    audio.addEventListener('play', playWave);
    audio.addEventListener('pause', pauseWave);

    return () => {
      audio.removeEventListener('play', playWave);
      audio.removeEventListener('pause', pauseWave);
      wavizReference.current.visualizer.stop();
    };
  }, [src, lineWidth, lineColor, multipliyer]);

  return (
    <div className='content'>
      <canvas ref={canvasReference} width={500} height={250}></canvas>
      <audio ref={audioReference} src={src} controls crossOrigin='anonymous'></audio>
    </div>
  );
}
export default PlugPlayComponent;

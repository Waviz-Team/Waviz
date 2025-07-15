import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";

type vizComponentProps = {
  src: any; // should be a react reference
  srcCanvas: any;
  options: {};
};

function WaveComponent({ src, srcCanvas, options }: vizComponentProps) {

  // References
  const wavizReference = useRef<Waviz | null>(null);
  const isPlaying = useRef(false);
  const canvasRef = useRef(null)
  if(srcCanvas){
    canvasRef.current = srcCanvas.current
  }
  // Use Effect Logic
  useEffect(() => {
    
    // Check if canvas exists
    if (!canvasRef.current) return;

    if (!wavizReference.current && src.current && canvasRef.current) {
      wavizReference.current = new Waviz(
        canvasRef.current,
        src.current
      );
    }

if(src.current instanceof HTMLAudioElement){

  // Start visualizer
  function playWave() {
    if (!isPlaying.current) {
      wavizReference.current.wave(options);
      isPlaying.current = true;
    }
  }

  // Stop visualizer
  function stopWave() {
    if (isPlaying.current) {
      wavizReference.current.visualizer.stop();
      isPlaying.current = false;
    }
  }

  // Event listeners -
  src.current.addEventListener("play", playWave);
  src.current.addEventListener("pause", stopWave);
}else{
  wavizReference.current.wave(options);
}
  }, [src, options, isPlaying, srcCanvas]);

  return (
    <div>
      <canvas ref={canvasRef} width={500} height={250}></canvas>

    </div>
  );
}
export default WaveComponent;




import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";

type vizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {};
  audioContext?: AudioContext;
};

function WaveComponent({ srcAudio, srcCanvas, options, audioContext }: vizComponentProps) {
  // References
  const wavizReference = useRef<Waviz | null>(null);
  const isPlaying = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered

  // Use Effect Logic
 useEffect(() => { //Check if canvas is passed in and assign srcCanvas to canvasRef if passed in
    if (srcCanvas && srcCanvas.current) {
      canvasRef.current = srcCanvas.current
      setCanvasReady(true);
    }
 }, [srcCanvas])

 useEffect(() => {
  if (!srcCanvas && canvasRef.current) {
    setCanvasReady(true);
  }
 }, [canvasRef.current, srcCanvas]);
  
  useEffect(() => {
    // Check if canvas exists
    if (!canvasReady || !canvasRef.current || !srcAudio.current) return;

    if (!wavizReference.current) {
      wavizReference.current = new Waviz(canvasRef.current, srcAudio.current, audioContext);
    }

    if (srcAudio.current instanceof HTMLAudioElement) {
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
      srcAudio.current.addEventListener("play", playWave);
      srcAudio.current.addEventListener("pause", stopWave);
      
      return () => { // Cleanup Listeners //! Possibly not needed...
        srcAudio.current.removeEventListener("play", playWave)
        srcAudio.current.removeEventListener("pause", stopWave)
      };
    } else {
      wavizReference.current.wave(options);
    }
  }, [canvasReady, srcAudio, options, isPlaying, audioContext]);

  return (
    <div>
      {!srcCanvas && <canvas ref={canvasRef} width={500} height={300}></canvas>}
    </div>
  );
}
export default WaveComponent;

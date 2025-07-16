import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";

type vizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement>;
  options?: {};
  audioContext?: AudioContext;
};

function BarComponent({ srcAudio, srcCanvas, options, audioContext }: vizComponentProps) {
  // References
  const wavizReference = useRef<Waviz | null>(null);
  const isPlaying = useRef(false);
  const canvasRef = useRef(null);
  const [canvasReady, setCanvasReady] = useState(false);

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
      function playBars() {
        if (!isPlaying.current) {
          wavizReference.current.bar(options);
          isPlaying.current = true;
        }
      }

      // Stop visualizer
      function stopBars() {
        if (isPlaying.current) {
          wavizReference.current.visualizer.stop();
          isPlaying.current = false;
        }
      }

      // Event listeners -
      srcAudio.current.addEventListener("play", playBars);
      srcAudio.current.addEventListener("pause", stopBars);

      return () => { // Cleanup Listeners //! Possibly not needed...
        srcAudio.current.removeEventListener("play", playBars)
        srcAudio.current.removeEventListener("pause", stopBars)
      };
    } else {
      wavizReference.current.bar(options);
    }
  }, [canvasReady ,srcAudio, options, isPlaying, audioContext]);

  return (
    <div>
      {!srcCanvas && <canvas ref={canvasRef} width={500} height={300}></canvas>}
    </div>
  );
}
export default BarComponent;

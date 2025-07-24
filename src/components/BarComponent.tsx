import React, { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";

type vizComponentProps = {
  srcAudio: any;
  srcCanvas?: React.RefObject<HTMLCanvasElement | null>;
  options?: {};
  audioContext?: AudioContext;
};

function BarComponent({ srcAudio, srcCanvas, options, audioContext }: vizComponentProps) {
  // References
  const wavizReference = useRef<Waviz | null>(null);
  const canvasRef = useRef(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // Use Effect Logic
 useEffect(() => { //Check if canvas is passed in and assign srcCanvas to canvasRef if passed in
    if (srcCanvas?.current) {
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
      const playBars = () => wavizReference.current?.bar(options);
      const stopBars = () => wavizReference.current?.visualizer.stop();
      
      // Event Listeners
      srcAudio.current.addEventListener("play", playBars);
      srcAudio.current.addEventListener("pause", stopBars);

      return () => { // Cleanup Listeners
        srcAudio.current.removeEventListener("play", playBars);
        srcAudio.current.removeEventListener("pause", stopBars);
        wavizReference.current?.visualizer.stop();
      };
    } else {
      wavizReference.current.bar(options);
    }
  }, [canvasReady, srcAudio, options, audioContext]);

  return (
    <div>
      {!srcCanvas && <canvas ref={canvasRef} width={500} height={300}></canvas>}
    </div>
  );
}
export default BarComponent;

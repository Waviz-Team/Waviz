import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import Waviz from "../core/waviz";
function WaveComponent({ srcAudio, srcCanvas, options, audioContext }) {
    // References
    const wavizReference = useRef(null);
    const isPlaying = useRef(false);
    const canvasRef = useRef(null);
    const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
    // Use Effect Logic
    useEffect(() => {
        if (srcCanvas && srcCanvas.current) {
            canvasRef.current = srcCanvas.current;
            setCanvasReady(true);
        }
    }, [srcCanvas]);
    useEffect(() => {
        if (!srcCanvas && canvasRef.current) {
            setCanvasReady(true);
        }
    }, [canvasRef.current, srcCanvas]);
    useEffect(() => {
        // Check if canvas exists
        if (!canvasReady || !canvasRef.current || !srcAudio.current)
            return;
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
            return () => {
                srcAudio.current.removeEventListener("play", playWave);
                srcAudio.current.removeEventListener("pause", stopWave);
            };
        }
        else {
            wavizReference.current.wave(options);
        }
    }, [canvasReady, srcAudio, options, isPlaying, audioContext]);
    return (_jsx("div", { children: !srcCanvas && _jsx("canvas", { ref: canvasRef, width: 500, height: 300 }) }));
}
export default WaveComponent;
//# sourceMappingURL=WaveComponent.js.map
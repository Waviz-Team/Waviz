import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import Waviz from "../core/waviz";
function BarComponent({ srcAudio, srcCanvas, options }) {
    // References
    const wavizReference = useRef(null);
    const isPlaying = useRef(false);
    const canvasRef = useRef(null);
    // Use Effect Logic
    useEffect(() => {
        //Check if canvas is passed in
        if (srcCanvas) {
            canvasRef.current = srcCanvas.current;
        }
        // Check if canvas exists
        if (!canvasRef.current)
            return;
        if (!wavizReference.current && srcAudio.current && canvasRef.current) {
            wavizReference.current = new Waviz(canvasRef.current, srcAudio.current);
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
        }
        else {
            wavizReference.current.bar(options);
        }
    }, [srcAudio, srcCanvas, options, isPlaying,]);
    return (_jsxs("div", { children: [!srcCanvas && _jsx("canvas", { ref: canvasRef, width: 500, height: 300 }), true && canvasRef.current] }));
}
export default BarComponent;
//# sourceMappingURL=BarComponent.js.map
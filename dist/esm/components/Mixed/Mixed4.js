import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import Waviz from "../../core/waviz";
function Mixed4({ srcAudio, srcCanvas, options, audioContext }) {
    // References
    const wavizReference = useRef(null);
    const canvasRef = useRef(null);
    const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
    let userOptions = {};
    if (options) {
        userOptions = { color: [options[0]], viz: ['bars', options[1]] };
    }
    const defaults = [
        {
            domain: ['time', 500],
            coord: ['polar', 100],
            viz: ['bars', 64],
            color: ['linearGradient', '#B50E7A', '#C41A62'],
            stroke: [6],
        },
        {
            domain: ['time', 500],
            coord: ['polar', 100],
            viz: ['line'],
            color: ['linearGradient', '#1A97C4', '#1893B8'],
            stroke: [4],
        },
        {
            domain: ['time', 250],
            coord: ['polar', 0, 0, 0.1], // center particles with slight auto-rotation
            viz: ['particles', [1, 1], 0, 200, 4, 80],
            color: ['randomPalette', ['#ffffff', '#ff00cc', '#00ffff', '#f5f5f5', '#99ccff']],
            stroke: [0.7],
        },
    ];
    const optionsObject = Object.assign(defaults, userOptions);
    // Use Effect Logic
    useEffect(() => {
        if (srcCanvas === null || srcCanvas === void 0 ? void 0 : srcCanvas.current) { //! Logic shortened with ? operator to throw undefined instead of of error
            canvasRef.current = srcCanvas.current;
            setCanvasReady(true);
        }
        else if (canvasRef.current) {
            setCanvasReady(true);
        }
    }, [srcCanvas]);
    useEffect(() => {
        // Check if canvas exists
        if (!canvasReady || !canvasRef.current || !srcAudio.current)
            return;
        if (!wavizReference.current) {
            wavizReference.current = new Waviz(canvasRef.current, srcAudio.current, audioContext);
        }
        if (srcAudio.current instanceof HTMLAudioElement) {
            const playWave = () => { var _a; return (_a = wavizReference.current) === null || _a === void 0 ? void 0 : _a.render(optionsObject); };
            const stopWave = () => { var _a; return (_a = wavizReference.current) === null || _a === void 0 ? void 0 : _a.visualizer.stop(); };
            // Event Listeners
            srcAudio.current.addEventListener("play", playWave);
            srcAudio.current.addEventListener("pause", stopWave);
            return () => {
                var _a;
                srcAudio.current.removeEventListener("play", playWave);
                srcAudio.current.removeEventListener("pause", stopWave);
                (_a = wavizReference.current) === null || _a === void 0 ? void 0 : _a.visualizer.stop();
            };
        }
        else {
            wavizReference.current.render(optionsObject);
        }
    }, [canvasReady, srcAudio, options, audioContext]);
    return (_jsx("div", { children: !srcCanvas && _jsx("canvas", { ref: canvasRef, width: 500, height: 300 }) }));
}
export default Mixed4;
//# sourceMappingURL=Mixed4.js.map
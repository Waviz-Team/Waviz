import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import Waviz from "../../core/waviz";
function Mixed10({ srcAudio, srcCanvas, options, audioContext }) {
    // References
    const wavizReference = useRef(null);
    const canvasRef = useRef(null);
    const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
    let userOptions = {};
    if (options) {
        userOptions = { color: [options[0]], domain: ['time', options[1]] };
    }
    const defaults = [
        {
            domain: ['time', 250],
            coord: ['polar', 120],
            viz: ['line'],
            color: ['linearGradient', '#6BB818', '#139133'],
            stroke: [3],
        },
        {
            domain: ['time', 350],
            coord: ['polar', 130],
            viz: ['line'],
            color: ['linearGradient', '#D91CE6', '#D022E3'],
            stroke: [2],
        },
        {
            domain: ['time', 450],
            coord: ['polar', 130],
            viz: ['line'],
            color: ['linearGradient', '#1882C4', '#163AC9'],
            stroke: [2],
        },
        {
            domain: ['time', 250],
            coord: ['polar', 120],
            viz: ['particles'],
            color: ['linearGradient', '#E322A6', '#139133'],
            stroke: [2],
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
export default Mixed10;
//# sourceMappingURL=Mixed10.js.map
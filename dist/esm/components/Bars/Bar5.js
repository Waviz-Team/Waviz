import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import Waviz from "../../core/waviz";
function Bar4({ srcAudio, srcCanvas, options, audioContext }) {
    // References
    const wavizReference = useRef(null);
    const canvasRef = useRef(null);
    const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
    let userOptions = {};
    if (options) {
        userOptions = { color: ['linearGradient', options[0], options[1]], viz: ['bars', options[2]] };
    }
    const defaults = { domain: ['time', 300, , 'hamming'], viz: ['bars', 25], coord: ['rect'], color: ['linearGradient', '#E93EB7', '#24B9F7'], stroke: [25] };
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
export default Bar4;
//# sourceMappingURL=Bar5.js.map
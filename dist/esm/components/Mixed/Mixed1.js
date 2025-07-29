import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import Waviz from "../../core/waviz";
function Mixed1({ srcAudio, srcCanvas, options, audioContext }) {
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
            domain: ['freq', 200],
            coord: ['polar', 120],
            viz: ['bars', 200],
            color: ['randomPalette', ['#00BFFF', '#40E0D0', '#5AC8FA', '#0096FF',
                ]],
            stroke: [2, 'dashes'],
        },
        {
            domain: ['time', 100],
            coord: ['polar'],
            viz: ['particles', [1, 1], 0, 90, 3, 100],
            color: ['randomPalette', ['#00BCD4', '#3F51B5', '#8E24AA', '#E91E63']],
            stroke: [2],
        },
        // {
        //   domain: ['time', 300],              
        //   coord: ['rect'],                     
        //   viz: ['bars'], 
        //   color: ['randomPalette', '#3F51B5', '#00BCD4', '#8E24AA'], 
        //   stroke: [3],
        // }
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
export default Mixed1;
//# sourceMappingURL=Mixed1.js.map
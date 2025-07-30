import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import Waviz from '../../core/waviz';
function Mixed10({ srcAudio, srcCanvas, options, audioContext, }) {
    // References
    const wavizReference = useRef(null);
    const canvasRef = useRef(null);
    const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
    let userOptions = {};
    if (options) {
        userOptions = [
            { color: ['radialGradient', options[0], options[1]] },
            { color: ['radialGradient', options[0], options[1]] },
            { color: ['radialGradient', options[0], options[1]] },
            { color: ['radialGradient', options[0], options[1]] },
            { color: ['radialGradient', options[0], options[1]] },
        ];
    }
    const defaults = [
        {
            domain: ['time', 250],
            coord: ['polar', 90],
            viz: ['line'],
            color: ['radialGradient', '#315f00ff', '#adffc1ff', 90, 120],
            stroke: [3],
        },
        {
            domain: ['time', 350],
            coord: ['polar', 100],
            viz: ['line'],
            color: ['radialGradient', '#76003fff', '#ef62ffff', 120, 150],
            stroke: [2],
        },
        {
            domain: ['time', 450],
            coord: ['polar', 100],
            viz: ['line'],
            color: ['radialGradient', '#009dffff', '#0f0062ff'],
            stroke: [2],
        },
        {
            domain: ['time', 250],
            coord: ['polar', 120],
            viz: ['particles', , , , 2, 50],
            color: ['radialGradient', '#E322A6', '#139133'],
            stroke: [2],
        },
    ];
    const optionsObject = [
        Object.assign(defaults[0], userOptions[0]),
        Object.assign(defaults[1], userOptions[1]),
        Object.assign(defaults[2], userOptions[2]),
        Object.assign(defaults[3], userOptions[3]),
    ];
    // Use Effect Logic
    useEffect(() => {
        //Check if canvas is passed in and assign srcCanvas to canvasRef if passed in
        if (srcCanvas === null || srcCanvas === void 0 ? void 0 : srcCanvas.current) {
            //! Logic shortened with ? operator to throw undefined instead of of error
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
            srcAudio.current.addEventListener('play', playWave);
            srcAudio.current.addEventListener('pause', stopWave);
            return () => {
                var _a;
                // Cleanup Listeners
                srcAudio.current.removeEventListener('play', playWave);
                srcAudio.current.removeEventListener('pause', stopWave);
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
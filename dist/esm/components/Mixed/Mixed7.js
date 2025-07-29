import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import Waviz from '../../core/waviz';
function Mixed7({ srcAudio, srcCanvas, options, audioContext, }) {
    // References
    const wavizReference = useRef(null);
    const canvasRef = useRef(null);
    const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendeteal
    // User options
    let userOptions = {};
    if (options) {
        userOptions = [
            {
                domain: ['time', 300, 100],
                coord: ['rect', 100],
                viz: ['particles', [1, 3], 0.1],
                color: ['linearGradient', options[0], options[1], 'flip'],
                stroke: [4],
            },
            {
                domain: ['time', 300, 100],
                coord: ['rect', 100],
                viz: ['line'],
                color: [options[0]],
                stroke: [5],
            },
        ];
    }
    const defaults = [
        {
            domain: ['time', 300, 100],
            coord: ['rect', 100],
            viz: ['particles', [1, 3], 0.1],
            color: ['linearGradient', 'white', 'teal', 'flip'],
            stroke: [4],
        },
        {
            domain: ['time', 300, 100],
            coord: ['rect', 100],
            viz: ['line'],
            color: ['snow'],
            stroke: [5],
        },
    ];
    const optionsObject = [
        Object.assign(defaults[0], userOptions[0]),
        Object.assign(defaults[1], userOptions[1]),
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
export default Mixed7;
//# sourceMappingURL=Mixed7.js.map
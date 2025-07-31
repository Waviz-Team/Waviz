import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import Waviz from '../../core/waviz';
function Wave3({ srcAudio, srcCanvas, options, audioContext, }) {
    // References
    const wavizReference = useRef(null);
    const canvasRef = useRef(null);
    const [canvasReady, setCanvasReady] = useState(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
    let userOptions = {};
    if (options) {
        userOptions = [
            { color: [options[0]] },
            { color: [options[1]] },
            { color: [options[2]] },
        ];
    }
    const defaults = [
        {
            domain: ['time', 400],
            coord: ['rect'],
            viz: ['line'],
            color: ['#2F4FC4'],
            stroke: [3],
        },
        {
            domain: ['time', 300],
            coord: ['rect'],
            viz: ['line'],
            color: ['#DED414'],
            stroke: [2],
        },
        {
            domain: ['time', 200],
            coord: ['rect'],
            viz: ['line'],
            color: ['#DE3914'],
            stroke: [1],
        },
    ];
    const optionsObject = [
        Object.assign({}, defaults[0], userOptions[0]),
        Object.assign({}, defaults[1], userOptions[1]),
        Object.assign({}, defaults[2], userOptions[2]),
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
export default Wave3;
//# sourceMappingURL=Wave3.js.map
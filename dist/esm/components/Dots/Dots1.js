import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import Waviz from '../../core/waviz';
function Dots1({ srcAudio, srcCanvas, options, audioContext, }) {
    const wavizReference = useRef(null);
    const canvasRef = useRef(null);
    const [canvasReady, setCanvasReady] = useState(false);
    // User-provided options
    let userOptions = {};
    if (options && Array.isArray(options)) {
        userOptions = {
            viz: ['dots', options[1]], // or try "dots", "polarBars", etc.
            color: [options[0]], // e.g., '#ff00ff' or gradient string
            stroke: [6], // thicker stroke for flashy style
        };
    }
    // Default fallback options
    const defaults = {
        domain: ['time', 200],
        viz: ['dots', 32],
        color: ['#ff00ff'], // vibrant pink
        stroke: [4],
    };
    const optionsObject = Object.assign({}, defaults, userOptions);
    useEffect(() => {
        if (srcCanvas === null || srcCanvas === void 0 ? void 0 : srcCanvas.current) {
            canvasRef.current = srcCanvas.current;
            setCanvasReady(true);
        }
        else if (canvasRef.current) {
            setCanvasReady(true);
        }
    }, [srcCanvas]);
    useEffect(() => {
        if (!canvasReady || !canvasRef.current || !srcAudio.current)
            return;
        if (!wavizReference.current) {
            wavizReference.current = new Waviz(canvasRef.current, srcAudio.current, audioContext);
        }
        if (srcAudio.current instanceof HTMLAudioElement) {
            const playViz = () => { var _a; return (_a = wavizReference.current) === null || _a === void 0 ? void 0 : _a.render(optionsObject); };
            const stopViz = () => { var _a; return (_a = wavizReference.current) === null || _a === void 0 ? void 0 : _a.visualizer.stop(); };
            srcAudio.current.addEventListener('play', playViz);
            srcAudio.current.addEventListener('pause', stopViz);
            return () => {
                var _a;
                srcAudio.current.removeEventListener('play', playViz);
                srcAudio.current.removeEventListener('pause', stopViz);
                (_a = wavizReference.current) === null || _a === void 0 ? void 0 : _a.visualizer.stop();
            };
        }
        else {
            wavizReference.current.render(optionsObject);
        }
    }, [canvasReady, srcAudio, options, audioContext]);
    return (_jsx("div", { children: !srcCanvas && (_jsx("canvas", { ref: canvasRef, width: 600, height: 350, style: { backgroundColor: 'black', borderRadius: '8px' } })) }));
}
export default Dots1;
//# sourceMappingURL=Dots1.js.map
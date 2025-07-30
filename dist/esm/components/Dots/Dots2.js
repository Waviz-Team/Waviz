import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import Waviz from '../../core/waviz';
function Dots2({ srcAudio, srcCanvas, options, audioContext, }) {
    const wavizReference = useRef(null);
    const canvasRef = useRef(null);
    const [canvasReady, setCanvasReady] = useState(false);
    // User-provided options
    let userOptions = {};
    if (options && Array.isArray(options)) {
        userOptions = [
            { color: ['linearGradient', options[0], options[1]] },
            { color: ['linearGradient', options[0], options[1]] },
            { color: ['linearGradient', options[0], options[1]] },
            { color: ['linearGradient', options[0], options[1]] },
            { color: ['linearGradient', options[0], options[1]] },
        ];
    }
    // Default fallback options
    const defaults = [
        {
            domain: ['time'],
            coord: ['rect'],
            viz: ['dots'],
            color: ['linearGradient'],
            stroke: [2],
        },
        {
            domain: ['time', 200],
            coord: ['rect'],
            viz: ['dots'],
            color: ['linearGradient'],
            stroke: [2],
        },
        {
            domain: ['time', 300],
            coord: ['rect'],
            viz: ['dots'],
            color: ['linearGradient'],
            stroke: [2],
        },
        {
            domain: ['time', 400],
            coord: ['rect'],
            viz: ['dots'],
            color: ['linearGradient'],
            stroke: [2],
        },
        {
            domain: ['time', 500],
            coord: ['rect'],
            viz: ['dots'],
            color: ['linearGradient'],
            stroke: [2],
        },
    ];
    const optionsObject = [
        Object.assign({}, defaults[0], userOptions[0]),
        Object.assign({}, defaults[1], userOptions[1]),
        Object.assign({}, defaults[2], userOptions[2]),
        Object.assign({}, defaults[3], userOptions[3]),
        Object.assign({}, defaults[4], userOptions[4]),
    ];
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
export default Dots2;
//# sourceMappingURL=Dots2.js.map
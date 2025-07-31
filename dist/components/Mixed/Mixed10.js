"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const waviz_1 = __importDefault(require("../../core/waviz"));
function Mixed10({ srcAudio, srcCanvas, options, audioContext, }) {
    // References
    const wavizReference = (0, react_1.useRef)(null);
    const canvasRef = (0, react_1.useRef)(null);
    const [canvasReady, setCanvasReady] = (0, react_1.useState)(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
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
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        // Check if canvas exists
        if (!canvasReady || !canvasRef.current || !srcAudio.current)
            return;
        if (!wavizReference.current) {
            wavizReference.current = new waviz_1.default(canvasRef.current, srcAudio.current, audioContext);
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
    return ((0, jsx_runtime_1.jsx)("div", { children: !srcCanvas && (0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, width: 500, height: 300 }) }));
}
exports.default = Mixed10;
//# sourceMappingURL=Mixed10.js.map
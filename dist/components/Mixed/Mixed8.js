"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const waviz_1 = __importDefault(require("../../core/waviz"));
function Mixed8({ srcAudio, srcCanvas, options, audioContext, }) {
    // References
    const wavizReference = (0, react_1.useRef)(null);
    const canvasRef = (0, react_1.useRef)(null);
    const [canvasReady, setCanvasReady] = (0, react_1.useState)(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
    let userOptions = {};
    if (options) {
        userOptions = [
            { color: ['linearGradient', options[0], options[1]] },
            { color: ['linearGradient', options[0], options[1]] },
            { color: ['linearGradient', options[0], options[1]] },
            { color: ['linearGradient', options[0], options[1]] },
            { color: ['linearGradient', options[0], options[1]] },
        ];
    }
    const defaults = [
        {
            domain: ['time', 500],
            color: ['linearGradient', '#00FFFF', '#8A2BE2'],
            stroke: [5],
        },
        {
            domain: ['time', 400],
            color: ['linearGradient', '#20B2AA', '#8A2BE2'],
            stroke: [4],
        },
        {
            domain: ['time', 300],
            color: ['linearGradient', '#7FFFD4', '#6A5ACD'],
            stroke: [3],
        },
        {
            domain: ['time', 400],
            viz: ['particles', [1, 1], 0.02, 30, 5, 40], // velocity, gravity, lifespan, birthrate, samples
            color: ['linearGradient', '#7FFFD4', '#00FFFF'],
            stroke: [2],
        },
        {
            domain: ['time', 400],
            viz: ['particles', [1, 1], -0.02, 30, 5, 40], // velocity, gravity, lifespan, birthrate, samples
            color: ['linearGradient', '#7FFFD4'],
            stroke: [2],
        },
    ];
    const optionsObject = [
        Object.assign(defaults[0], userOptions[0]),
        Object.assign(defaults[1], userOptions[1]),
        Object.assign(defaults[2], userOptions[2]),
        Object.assign(defaults[3], userOptions[3]),
        Object.assign(defaults[4], userOptions[4]),
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
exports.default = Mixed8;
//# sourceMappingURL=Mixed8.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const waviz_1 = __importDefault(require("../../core/waviz"));
function Mixed6({ srcAudio, srcCanvas, options, audioContext, }) {
    // References
    const wavizReference = (0, react_1.useRef)(null);
    const canvasRef = (0, react_1.useRef)(null);
    const [canvasReady, setCanvasReady] = (0, react_1.useState)(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
    // User options
    let userOptions = {};
    if (options) {
        userOptions = [
            {
                domain: ['time', 300, 100, 'hann'],
                coord: ['polar', 100, 90],
                viz: ['particles', [0.5, 0.5], -0.01, , 5, 20],
                color: ['linearGradient', options[0], options[1], 'flip'],
                stroke: [4],
            },
            {
                domain: ['time', 300, 100, 'hann'],
                coord: ['polar', 100, 90],
                viz: ['line'],
                color: ['linearGradient', options[0], options[1], 'flip'],
                stroke: [5],
            },
        ];
    }
    const defaults = [
        {
            domain: ['time', 300, 100, 'hann'],
            coord: ['polar', 100, 90],
            viz: ['particles', [0.5, 0.5], -0.01, , 5, 20],
            color: ['linearGradient', 'yellow', 'red', 'flip'],
            stroke: [4],
        },
        {
            domain: ['time', 300, 100, 'hann'],
            coord: ['polar', 100, 90],
            viz: ['line'],
            color: ['linearGradient', 'yellow', 'red', 'flip'],
            stroke: [5],
        },
    ];
    const optionsObject = [
        Object.assign(defaults[0], userOptions[0]),
        Object.assign(defaults[1], userOptions[1]),
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
exports.default = Mixed6;
//# sourceMappingURL=Mixed6.js.map
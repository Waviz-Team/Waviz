"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const waviz_1 = __importDefault(require("../../core/waviz"));
function Dots1({ srcAudio, srcCanvas, options, audioContext }) {
    const wavizReference = (0, react_1.useRef)(null);
    const canvasRef = (0, react_1.useRef)(null);
    const [canvasReady, setCanvasReady] = (0, react_1.useState)(false);
    // User-provided options
    let userOptions = {};
    if (options && Array.isArray(options)) {
        userOptions = {
            viz: ["dots", options[1]], // or try "dots", "polarBars", etc.
            color: [options[0]], // e.g., '#ff00ff' or gradient string
            glow: [true],
            stroke: [6], // thicker stroke for flashy style
            amplitudeScale: [2.5], // more bounce
            smoothing: [0.7], // optional, for smoother transitions
        };
    }
    // Default fallback options
    const defaults = {
        domain: ['time', 1024],
        viz: ['dots', 16],
        color: ['#ff00ff'], // vibrant pink
        glow: [true],
        stroke: [6],
        amplitudeScale: [2.5],
        smoothing: [0.7],
    };
    const optionsObject = Object.assign({}, defaults, userOptions);
    (0, react_1.useEffect)(() => {
        if (srcCanvas === null || srcCanvas === void 0 ? void 0 : srcCanvas.current) {
            canvasRef.current = srcCanvas.current;
            setCanvasReady(true);
        }
        else if (canvasRef.current) {
            setCanvasReady(true);
        }
    }, [srcCanvas]);
    (0, react_1.useEffect)(() => {
        if (!canvasReady || !canvasRef.current || !srcAudio.current)
            return;
        if (!wavizReference.current) {
            wavizReference.current = new waviz_1.default(canvasRef.current, srcAudio.current, audioContext);
        }
        if (srcAudio.current instanceof HTMLAudioElement) {
            const playViz = () => { var _a; return (_a = wavizReference.current) === null || _a === void 0 ? void 0 : _a.render(optionsObject); };
            const stopViz = () => { var _a; return (_a = wavizReference.current) === null || _a === void 0 ? void 0 : _a.visualizer.stop(); };
            srcAudio.current.addEventListener("play", playViz);
            srcAudio.current.addEventListener("pause", stopViz);
            return () => {
                var _a;
                srcAudio.current.removeEventListener("play", playViz);
                srcAudio.current.removeEventListener("pause", stopViz);
                (_a = wavizReference.current) === null || _a === void 0 ? void 0 : _a.visualizer.stop();
            };
        }
        else {
            wavizReference.current.render(optionsObject);
        }
    }, [canvasReady, srcAudio, options, audioContext]);
    return ((0, jsx_runtime_1.jsx)("div", { children: !srcCanvas && ((0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, width: 600, height: 350, style: { backgroundColor: "black", borderRadius: "8px" } })) }));
}
exports.default = Dots1;
//# sourceMappingURL=Dots1.js.map
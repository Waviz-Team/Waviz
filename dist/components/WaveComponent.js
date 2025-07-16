"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const waviz_1 = __importDefault(require("../core/waviz"));
function WaveComponent({ srcAudio, srcCanvas, options, audioContext }) {
    // References
    const wavizReference = (0, react_1.useRef)(null);
    const isPlaying = (0, react_1.useRef)(false);
    const canvasRef = (0, react_1.useRef)(null);
    const [canvasReady, setCanvasReady] = (0, react_1.useState)(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
    // Use Effect Logic
    (0, react_1.useEffect)(() => {
        if (srcCanvas && srcCanvas.current) {
            canvasRef.current = srcCanvas.current;
            setCanvasReady(true);
        }
    }, [srcCanvas]);
    (0, react_1.useEffect)(() => {
        if (!srcCanvas && canvasRef.current) {
            setCanvasReady(true);
        }
    }, [canvasRef.current, srcCanvas]);
    (0, react_1.useEffect)(() => {
        // Check if canvas exists
        if (!canvasReady || !canvasRef.current || !srcAudio.current)
            return;
        if (!wavizReference.current) {
            wavizReference.current = new waviz_1.default(canvasRef.current, srcAudio.current, audioContext);
        }
        if (srcAudio.current instanceof HTMLAudioElement) {
            // Start visualizer
            function playWave() {
                if (!isPlaying.current) {
                    wavizReference.current.wave(options);
                    isPlaying.current = true;
                }
            }
            // Stop visualizer
            function stopWave() {
                if (isPlaying.current) {
                    wavizReference.current.visualizer.stop();
                    isPlaying.current = false;
                }
            }
            // Event listeners -
            srcAudio.current.addEventListener("play", playWave);
            srcAudio.current.addEventListener("pause", stopWave);
            return () => {
                srcAudio.current.removeEventListener("play", playWave);
                srcAudio.current.removeEventListener("pause", stopWave);
            };
        }
        else {
            wavizReference.current.wave(options);
        }
    }, [canvasReady, srcAudio, options, isPlaying, audioContext]);
    return ((0, jsx_runtime_1.jsx)("div", { children: !srcCanvas && (0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, width: 500, height: 300 }) }));
}
exports.default = WaveComponent;
//# sourceMappingURL=WaveComponent.js.map
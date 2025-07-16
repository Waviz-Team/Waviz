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
    // Use Effect Logic
    (0, react_1.useEffect)(() => {
        //Check if canvas is passed in
        if (srcCanvas) {
            canvasRef.current = srcCanvas.current;
        }
        // Check if canvas exists
        if (!canvasRef.current)
            return;
        if (!wavizReference.current && srcAudio.current && canvasRef.current) {
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
        }
        else {
            wavizReference.current.wave(options);
        }
    }, [srcAudio, srcCanvas, options, isPlaying, audioContext]);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [!srcCanvas && (0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, width: 500, height: 300 }), true && canvasRef.current] }));
}
exports.default = WaveComponent;
//# sourceMappingURL=WaveComponent.js.map
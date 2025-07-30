"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const waviz_1 = __importDefault(require("../../core/waviz"));
const colorUtils_1 = require("../../utils/colorUtils");
function Wave4({ srcAudio, srcCanvas, options, audioContext, }) {
    // References
    const wavizReference = (0, react_1.useRef)(null);
    const canvasRef = (0, react_1.useRef)(null);
    const [canvasReady, setCanvasReady] = (0, react_1.useState)(false); // Needed in case of defaulting back to preset canvas. UseRef only will not trigger page re-render, causing visualizer to run before canvas is rendered
    let userOptions = {};
    let defaults = [
        { domain: ['time', 450], color: ['#eb1b00ff'] },
        { domain: ['time', 400], color: ['#eb4300ff'] },
        { domain: ['time', 350], color: ['#ff6715ff'] },
        { domain: ['time', 300], color: ['#ff9320ff'] },
        { domain: ['time', 250], color: ['#ffb836ff'] },
        { domain: ['time', 200], color: ['#ffca68ff'] },
        { domain: ['time', 150], color: ['#ffdd9dff'] },
        { domain: ['time', 100], color: ['#ffeeceff'] },
    ];
    defaults.forEach((e, i) => {
        if (!options || typeof options !== 'string') {
            return;
        }
        else {
            let hsl;
            if (options.includes('rgb')) {
                const rgb = (0, colorUtils_1.rgbToArray)(options);
                hsl = (0, colorUtils_1.rgbToHsl)(rgb[0], rgb[1], rgb[2]);
            }
            else if (options.includes('hsl')) {
                hsl = (0, colorUtils_1.HSLtoArray)(options);
            }
            else if (options.includes('#')) {
                const rgb = (0, colorUtils_1.hexToRgb)(options);
                hsl = (0, colorUtils_1.rgbToHsl)(rgb[0], rgb[1], rgb[2]);
            }
            else {
                const hex = (0, colorUtils_1.getCSSColor)(options);
                const rgb = (0, colorUtils_1.hexToRgb)(hex);
                hsl = (0, colorUtils_1.rgbToHsl)(rgb[0], rgb[1], rgb[2]);
            }
            e.color[0] = `hsl(${hsl[0] + i * 10},${hsl[1] / ((i + 1) / 2)}%,${hsl[2]}%)`;
        }
    });
    const optionsObject = Object.assign(defaults, userOptions);
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
exports.default = Wave4;
//# sourceMappingURL=Wave4.js.map
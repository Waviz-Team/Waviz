"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const WaveComponent_1 = __importDefault(require("./components/WaveComponent"));
function App() {
    // audio element can take an HTMLAudioElement, microphone, or screenAudio
    const audioElement = (0, react_1.useRef)(null);
    const canvasElement = (0, react_1.useRef)(null);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "content", children: [(0, jsx_runtime_1.jsx)("img", { src: "/Logo.png", width: "200" }), (0, jsx_runtime_1.jsx)("img", { src: "/pnpLogo.png", width: "150" }), (0, jsx_runtime_1.jsx)(WaveComponent_1.default, { srcAudio: audioElement, srcCanvas: canvasElement, options: { lineColor: "blue", lineWidth: 2, multiplier: 1 } }), (0, jsx_runtime_1.jsx)("canvas", { ref: canvasElement, width: "800", height: "400" }), (0, jsx_runtime_1.jsx)("audio", { ref: audioElement, src: "/FreshFocus.mp3", controls: true })] }));
}
//# sourceMappingURL=App.js.map
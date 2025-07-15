import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import WaveComponent from "./components/WaveComponent";
export default function App() {
    // audio element can take an HTMLAudioElement, microphone, or screenAudio
    const audioElement = useRef(null);
    const canvasElement = useRef(null);
    return (_jsxs("div", { className: "content", children: [_jsx("img", { src: "/Logo.png", width: "200" }), _jsx("img", { src: "/pnpLogo.png", width: "150" }), _jsx(WaveComponent, { srcAudio: audioElement, srcCanvas: canvasElement, options: { lineColor: "blue", lineWidth: 2, multiplier: 1 } }), _jsx("canvas", { ref: canvasElement, width: "800", height: "400" }), _jsx("audio", { ref: audioElement, src: "/FreshFocus.mp3", controls: true })] }));
}
//# sourceMappingURL=App.js.map
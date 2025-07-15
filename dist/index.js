"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarComponent = exports.WaveComponent = exports.Visualizer = exports.AudioAnalyzer = exports.Input = exports.Waviz = void 0;
const waviz_1 = __importDefault(require("./core/waviz"));
exports.default = waviz_1.default;
// Main exports for Waviz library
var waviz_2 = require("./core/waviz");
Object.defineProperty(exports, "Waviz", { enumerable: true, get: function () { return __importDefault(waviz_2).default; } });
var input_1 = require("./input/input");
Object.defineProperty(exports, "Input", { enumerable: true, get: function () { return __importDefault(input_1).default; } });
var analyzer_1 = require("./analysers/analyzer");
Object.defineProperty(exports, "AudioAnalyzer", { enumerable: true, get: function () { return __importDefault(analyzer_1).default; } });
var Visualizer_1 = require("./visualizers/Visualizer");
Object.defineProperty(exports, "Visualizer", { enumerable: true, get: function () { return __importDefault(Visualizer_1).default; } });
var WaveComponent_1 = require("./components/WaveComponent");
Object.defineProperty(exports, "WaveComponent", { enumerable: true, get: function () { return __importDefault(WaveComponent_1).default; } });
var BarComponent_1 = require("./components/BarComponent");
Object.defineProperty(exports, "BarComponent", { enumerable: true, get: function () { return __importDefault(BarComponent_1).default; } });
//# sourceMappingURL=index.js.map
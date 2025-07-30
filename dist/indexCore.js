"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visualizer = exports.AudioAnalyzer = exports.Input = exports.Waviz = void 0;
const waviz_1 = __importDefault(require("./core/waviz"));
exports.default = waviz_1.default;
// Core library
var waviz_2 = require("./core/waviz");
Object.defineProperty(exports, "Waviz", { enumerable: true, get: function () { return __importDefault(waviz_2).default; } });
var input_1 = require("./input/input");
Object.defineProperty(exports, "Input", { enumerable: true, get: function () { return __importDefault(input_1).default; } });
var analyzer_1 = require("./analysers/analyzer");
Object.defineProperty(exports, "AudioAnalyzer", { enumerable: true, get: function () { return __importDefault(analyzer_1).default; } });
var visualizer_1 = require("./visualizers/visualizer");
Object.defineProperty(exports, "Visualizer", { enumerable: true, get: function () { return __importDefault(visualizer_1).default; } });
//# sourceMappingURL=indexCore.js.map
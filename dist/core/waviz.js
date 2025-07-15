"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = __importDefault(require("../input/input"));
const analyzer_1 = __importDefault(require("../analysers/analyzer"));
const Visualizer_1 = __importDefault(require("../visualizers/Visualizer"));
class Waviz {
    constructor(canvas, audioSource) {
        this.visualizer = null;
        this.isInitialized = false;
        this.audioAnalyzer = new analyzer_1.default();
        this.input = new input_1.default((sourceNode) => {
            this.setupAudioAnalysis(sourceNode);
        });
        if (canvas) {
            this.visualizer = new Visualizer_1.default(canvas, this.audioAnalyzer);
        }
        if (audioSource) {
            this.input.connectAudioSource(audioSource);
        }
    }
    //* WAVIZ setup methods
    setupAudioAnalysis(sourceNode) {
        const audioContext = this.input.getAudioContext();
        // Analysis start
        this.audioAnalyzer.startAnalysis(audioContext, sourceNode);
        this.isInitialized = true;
    }
    //* AudioAnalyzer delegator
    getFrequencyData() {
        if (!this.isInitialized)
            return null;
        return this.audioAnalyzer.getFrequencyData();
    }
    getTimeDomainData() {
        if (!this.isInitialized)
            return null;
        return this.audioAnalyzer.getTimeDomainData();
    }
    //* Input Delegator
    cleanup() {
        this.input.cleanup();
        this.isInitialized = false;
    }
    //* Visualizer Delegator
    //* Convenience Methods
    async wave(options) {
        await this.input.initializePending();
        this.visualizer.wave(options);
    }
    async bar(options) {
        await this.input.initializePending();
        this.visualizer.bars(options);
    }
}
exports.default = Waviz;
//# sourceMappingURL=waviz.js.map
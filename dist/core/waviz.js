"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = __importDefault(require("../input/input"));
const analyzer_1 = __importDefault(require("../analysers/analyzer"));
const visualizer_1 = __importDefault(require("../visualizers/visualizer"));
class Waviz {
    constructor(canvas, audioSource, audioContext) {
        this.visualizer = null;
        this.isInitialized = false;
        // Optional canvas passthrough for params
        this.audioAnalyzer = new analyzer_1.default();
        this.input = new input_1.default((sourceNode) => {
            // needed because setupAudioAnalysis needs to wait for async audio source
            this.setupAudioAnalysis(sourceNode);
        }, audioContext);
        if (canvas) {
            this.visualizer = new visualizer_1.default(canvas, this.audioAnalyzer);
        }
        if (audioSource) {
            this.input.connectAudioSource(audioSource);
        }
    }
    //* WAVIZ setup methods
    setupAudioAnalysis(sourceNode) {
        // Method to setup the Waviz audio analysis. Needed here because of async calls expected in Input. If moved up, sourceNode won't exist in time since constructor runs first.
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
    //* Convenience Methods Main
    async render(options) {
        await this.input.initializePending();
        this.visualizer.render(options);
    }
    stop() {
        this.visualizer.stop();
    }
    //* Conveninence Methods Presets
    async simpleLine(options) {
        await this.input.initializePending();
        this.visualizer.simpleLine(options);
    }
    async simpleBars(options) {
        await this.input.initializePending();
        this.visualizer.simpleBars(options);
    }
    async simplePolarLine(options) {
        await this.input.initializePending();
        this.visualizer.simplePolarLine(options);
    }
    async simplePolarBars(options) {
        await this.input.initializePending();
        this.visualizer.simplePolarBars(options);
    }
}
exports.default = Waviz;
//# sourceMappingURL=waviz.js.map
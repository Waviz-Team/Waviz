import Input from '../input/input';
import AudioAnalyzer from '../analysers/analyzer';
import Visualizer from '../visualizers/visualizer';
class Waviz {
    constructor(canvas, audioSource, audioContext) {
        this.visualizer = null;
        this.isInitialized = false;
        // Optional canvas passthrough for params
        this.audioAnalyzer = new AudioAnalyzer();
        this.input = new Input((sourceNode) => {
            // needed because setupAudioAnalysis needs to wait for async audio source
            this.setupAudioAnalysis(sourceNode);
        }, audioContext);
        if (canvas) {
            this.visualizer = new Visualizer(canvas, this.audioAnalyzer);
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
export default Waviz;
//# sourceMappingURL=waviz.js.map
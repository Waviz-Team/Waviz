import Input from "../input/input";
import AudioAnalyzer from "../analysers/analyzer";
import Visualizer from "../visualizers/Visualizer";
class Waviz {
    constructor(canvas, audioSource) {
        this.visualizer = null;
        this.isInitialized = false;
        this.audioAnalyzer = new AudioAnalyzer();
        this.input = new Input((sourceNode) => {
            this.setupAudioAnalysis(sourceNode);
        });
        if (canvas) {
            this.visualizer = new Visualizer(canvas, this.audioAnalyzer);
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
export default Waviz;
//# sourceMappingURL=waviz.js.map
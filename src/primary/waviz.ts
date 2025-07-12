import Input from "../input/input";
import AudioAnalyzer from "../analysers/analyzer";
import Visualizer from "../visualizers/Visualizer";

type VisualizationType = 'wave' | 'bars' | 'spectrum';
type AudioSourceType = HTMLAudioElement | MediaStream | 'microphone' | 'screenAudio' | string;

class Waviz {
    input: Input;
    audioAnalyzer: AudioAnalyzer;
    visualizer: Visualizer | null = null;
    isInitialized: boolean = false;

    constructor(canvas?: HTMLCanvasElement, audioSource?: AudioSourceType) { // Optional canvas passthrough for params
        this.audioAnalyzer = new AudioAnalyzer();
        this.input = new Input((sourceNode) => { // needed because setupAudioAnalysis needs to wait for async audio source
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
    private setupAudioAnalysis(sourceNode) { // Method to setup the Waviz audio analysis. Needed here because of async calls expected in Input. If moved up, sourceNode won't exist in time since constructor runs first.
        const audioContext = this.input.getAudioContext();

        // Analysis start
        this.audioAnalyzer.startAnalysis(audioContext, sourceNode);
        this.isInitialized = true;
    }

    // debugInfo() {
    //     if (!this.isInitialized || !this.audioAnalyzer) {
    //         return {
    //             error: 'initialization debug',
    //             isInitialized: this.isInitialized,
    //             hasAudioAnalyzer: !!this.audioAnalyzer // To convert value into boolean
    //         };
    //     }
    
    //     // const timeBuffer = this.audioAnalyzer.getTimeBuffer();
    //     // const freqBuffer = this.audioAnalyzer.getFreqBuffer();
    
    //     return {
    //         bufferLength: timeBuffer?.bufferLength || 0,
    //         timeDataLength: timeBuffer?.dataArray?.length || 0,
    //         freqDataLength: freqBuffer?.dataArray?.length || 0,
    //         audioContextState: this.input.getAudioContext()?.state
    //     };
    // }

    //* AudioAnalyzer delegator
    getFrequencyData() {
        if (!this.isInitialized) return null;
        return this.audioAnalyzer.getFrequencyData();
    }

    getTimeDomainData() {
        if (!this.isInitialized) return null;
        return this.audioAnalyzer.getTimeDomainData();
    }

    //* Input Delegator
    connectAudio = (audioSource: AudioSourceType) => this.input.connectToHTMLElement(audioSource);
    cleanup() {
        this.input.cleanup();
        this.isInitialized = false;
    }

    //* Visualizer Delegator
    // startVis(type: VisualizationType = 'wave') {
    //     if (this.visualizer && this.isInitialized) {
    //         this.visualizer.start(type);
    //     }
    // }

    // stopVis() {
    //     if (this.visualizer) {
    //         this.visualizer.stop();
    //     }
    // }

    //* Convenience Methods
    async wave() { //! JANKY FIX. WAIT FOR VIS CODE TO PLUG IN ASYNC
        await this.input.intializePending();
        this.visualizer.wave();
    }

    // bar() {
    //     this.startVis('bars')
    // }
}

export default Waviz;
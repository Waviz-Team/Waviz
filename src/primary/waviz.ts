import Input from "../input/input";
import AudioAnalyzer from "../analysers/analyzer";
import Visualizer from "../visualizers/Visualizer";

type VisualizationType = 'wave' | 'bars' | 'spectrum';

class Waviz {
    input: Input;
    audioAnalyzer: AudioAnalyzer;
    visualizer: Visualizer | null = null;
    isInitialized: boolean = false;

    constructor(canvas?: HTMLCanvasElement) { // Optional canvas passthrough for params
        this.audioAnalyzer = new AudioAnalyzer();
        this.input = new Input((sourceNode) => { // needed because setupAudioAnalysis needs to wait for async audio source
            this.setupAudioAnalysis(sourceNode);
        });
        
        if (canvas) {
            this.initializeVisualizer(canvas);
        }
    }

    //* WAVIZ setup methods
    private setupAudioAnalysis(sourceNode) { // Method to setup the Waviz audio analysis
        const audioContext = this.input.getAudioContext();

        if (!audioContext) { // Error handler for missing Audio Context
            console.error('Audio Context not found');
            return;
        }

        if (audioContext.state === 'suspended') { //! Perhaps not needed. Testing required. 
            audioContext.resume().then(() => {
                console.log('DEV: Audio context force started')
            })
        }

        // Analysis start
        this.audioAnalyzer.startAnalysis(audioContext, sourceNode);
        this.isInitialized = true;
    }

    private initializeVisualizer(canvas) {
        const liveData = {
            get timeData() {
                const buffer = this.audioAnalyzer.getTimeBuffer();
                return buffer ? buffer.dataArray : new Uint8Array(0); // Fallback needed so that undefined is not passed and visualizer can continue even when there's no data
            },
            get bufferLength() {
                const buffer = this.audioAnalyzer.getTimeBuffer();
                return buffer ? buffer.bufferlength : 0;
            },
            get frequencyData() {
                const buffer = this.audioAnalyzer.getFreqBuffer();
                return buffer ? buffer.dataArray : new Uint8Array(0);
            }
        };

        this.visualizer = new Visualizer(canvas, liveData);
    }

    // AudioAnalyzer delegator
    getFrequencyData() { //? Can do either like this or the below delegation
        if (!this.isInitialized) return null;
        return this.audioAnalyzer.getFrequencyData();
    }

    getTimeDomainData() {
        if (!this.isInitialized) return null;
        return this.audioAnalyzer.getTimeDomainData();
    }

    // Input Delegator
    connectToHTMLElement = (audioEl) => this.input.connectToHTMLElement(audioEl);
    loadAudioFile = (event) => this.input.loadAudioFile(event);
    cleanup() {
        this.input.cleanup();
        this.isInitialized = false;
    }
}

export default Waviz;
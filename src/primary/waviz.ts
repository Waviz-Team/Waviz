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

    private initializeVisualizer(canvas) { // Method to setup the Visualizer
        const analyzer = this.audioAnalyzer; // SUPER IMPORTANT TO CAPTURE DATA

        const liveData = {
            get timeData() { // Getter properties to execute function each time these are accessed so that data is always fresh
                const buffer = analyzer.getTimeBuffer();
                return buffer ? buffer.dataArray : new Uint8Array(0); // Fallback needed so that undefined is not passed and visualizer can continue even when there's no data
            },
            get bufferLength() {
                const buffer = analyzer.getTimeBuffer();
                return buffer ? buffer.bufferLength : 0;
            },
            get freqData() {
                const buffer = analyzer.getFreqBuffer();
                return buffer ? buffer.dataArray : new Uint8Array(0);
            }
        };

        this.visualizer = new Visualizer(canvas, liveData);
    }

    debugInfo() {
        if (!this.isInitialized || !this.audioAnalyzer) {
            return {
                error: 'initialization debug',
                isInitialized: this.isInitialized,
                hasAudioAnalyzer: !!this.audioAnalyzer // To convert value into boolean
            };
        }
    
        const timeBuffer = this.audioAnalyzer.getTimeBuffer();
        const freqBuffer = this.audioAnalyzer.getFreqBuffer();
    
        return {
            bufferLength: timeBuffer?.bufferLength || 0,
            timeDataLength: timeBuffer?.dataArray?.length || 0,
            freqDataLength: freqBuffer?.dataArray?.length || 0,
            audioContextState: this.input.getAudioContext()?.state
        };
    }

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
    connectToHTMLElement = (audioEl) => this.input.connectToHTMLElement(audioEl);
    loadAudioFile = (event) => this.input.loadAudioFile(event);
    cleanup() {
        this.input.cleanup();
        this.isInitialized = false;
    }

    //* Visualizer Delegator
    startVis(type: VisualizationType = 'wave') {
        if (this.visualizer && this.isInitialized) {
            this.visualizer.start(type);
        }
    }

    stopVis() {
        if (this.visualizer) {
            this.visualizer.stop();
        }
    }

    //* Convenience Methods
    wave() {
        this.startVis('wave')
    }

    bar() {
        this.startVis('bars')
    }
}

export default Waviz;
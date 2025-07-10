import Input from "../input/input";
import AudioAnalyzer from "../analysers/analyzer";

class Waviz {
    input: Input;
    audioAnalyzer: AudioAnalyzer;
    isInitialized: boolean = false;

    constructor() {
        this.audioAnalyzer = new AudioAnalyzer();
        this.input = new Input((sourceNode) => { // needed because setupAudioAnalysis needs to wait for async audio source
            this.setupAudioAnalysis(sourceNode);
        });
    }

    setupAudioAnalysis(sourceNode) { // Method to setup the Waviz audio analysis
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

    // AudioAnalyzer delegator
    getFrequencyData() { //? Can do either like this or the below delegation
        if (!this.isInitialized) return null;
        return this.audioAnalyzer.getFrequencyData();
    }

    getTimeDomainData = () => this.audioAnalyzer.getTimeDomainData();
    getFreqBuffer = () => this.audioAnalyzer.getFreqBuffer();
    getTimeBuffer = () => this.audioAnalyzer.getTimeBuffer();

    // Input Delegator
    connectToHTMLElement = (audioEl) => this.input.connectToHTMLElement(audioEl);
    loadAudioFile = (event) => this.input.loadAudioFile(event);
    cleanup() {
        this.input.cleanup();
        this.isInitialized = false;
    }
}

export default Waviz;
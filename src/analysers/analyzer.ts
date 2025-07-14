class AudioAnalyzer {
    analyserNode: AnalyserNode | null;
    dataArray: Uint8Array | null;
    frequencyDataArray: Uint8Array | null;
    timeDomainDataArray: Uint8Array | null;
    bufferLength: number | null;

    constructor() {
        this.dataArray = null;
        this.frequencyDataArray = null;
        this.timeDomainDataArray = null;

        this.bufferLength = null;
        this.analyserNode = null;
    }
    
    startAnalysis(audioContext: AudioContext, sourceNode: AudioNode) {
        if (!audioContext) { // Error handler for missing Audio Context
            console.error('Audio Context not found');
            return;
        }
        if (!sourceNode) {
            console.error('Source node not found');
            return;
        }

        this.analyserNode = audioContext.createAnalyser(); //needed to access properties

        if (audioContext.state === 'suspended') { //! Perhaps not needed. Testing required. 
            audioContext.resume().then(() => {
                 console.log('DEV: Audio context force started');
            })
        }

        this.analyserNode.fftSize = 2048; //TODO: Maybe allow users to set this (common vals: 256, 512, 1024, 2048+)
        this.bufferLength = this.analyserNode.frequencyBinCount; // = 1/2 of fftsize
        this.dataArray = new Uint8Array(this.bufferLength); // Array of bufferlength freq values (or bins)

        this.frequencyDataArray = new Uint8Array(this.bufferLength); 
        this.timeDomainDataArray = new Uint8Array(this.bufferLength); 
        // console.log(this.frequencyDataArray);

        sourceNode.connect(this.analyserNode);
    }

    getFrequencyData() {
        if (this.analyserNode && this.frequencyDataArray) {
            this.analyserNode.getByteFrequencyData(this.frequencyDataArray); // mutates dataArray
            return this.frequencyDataArray;
        }
        return null;
    }

    getTimeDomainData() {
        if (this.analyserNode && this.timeDomainDataArray) {
            this.analyserNode.getByteTimeDomainData(this.timeDomainDataArray); // mutates dataArray
            return this.timeDomainDataArray;
        }
        return null;
    }

    getDataArray() {
        return this.dataArray;
    }

    getBufferLength() {
        return this.bufferLength;
    }

    get timeData() {
        return this.getTimeDomainData() || new Uint8Array(0);
    }

    get freqData() {
        return this.getFrequencyData() || new Uint8Array(0);
    }

    //! This is creating typescript errors. I can't figure out how to fix this atm. Users can directly call the prop for now
    // get bufferLength() {
    //     return this.bufferLength || 0;
    // }
}

export default AudioAnalyzer;
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
        this.analyserNode = audioContext.createAnalyser(); //needed to access properties

        this.analyserNode.fftSize = 2048; //TODO: Maybe allow users to set this (common vals: 256, 512, 1024, 2048+)
        this.bufferLength = this.analyserNode.frequencyBinCount; // = 1/2 of fftsize
        this.dataArray = new Uint8Array(this.bufferLength); // Array of bufferlength freq values (or bins)

        this.frequencyDataArray = new Uint8Array(this.bufferLength); 
        this.timeDomainDataArray = new Uint8Array(this.bufferLength); 

        sourceNode.connect(this.analyserNode);
        this.analyserNode.connect(audioContext.destination); //! This line was missing
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

    getFreqBuffer() { // For Visualizer that expects object with dataArray + freqData
        if (this.analyserNode && this.frequencyDataArray && this.bufferLength) {
            const freqBuffObject = {
                dataArray: this.getFrequencyData(),
                bufferLength: this.bufferLength
            }
            console.log(this.frequencyDataArray);
            return freqBuffObject;
        }
        return null;
    }

    getTimeBuffer() { // For Visualizer that expects object with dataArray + timeData
        if (this.analyserNode && this.timeDomainDataArray && this.bufferLength) {
            const timeBuffObject = {
                dataArray: this.getTimeDomainData(),
                bufferLength: this.bufferLength
            }
            return timeBuffObject;
        }
        return null;        
    }
}

export default AudioAnalyzer;
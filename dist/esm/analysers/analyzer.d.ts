declare class AudioAnalyzer {
    analyserNode: AnalyserNode | null;
    dataArray: Uint8Array | null;
    frequencyDataArray: Uint8Array | null;
    timeDomainDataArray: Uint8Array | null;
    bufferLength: number | null;
    constructor();
    startAnalysis(audioContext: AudioContext, sourceNode: AudioNode): void;
    getFrequencyData(): Uint8Array<ArrayBuffer>;
    getTimeDomainData(): Uint8Array<ArrayBuffer>;
    getDataArray(): Uint8Array<ArrayBuffer>;
    getBufferLength(): number;
    get timeData(): Uint8Array<ArrayBuffer>;
    get freqData(): Uint8Array<ArrayBuffer>;
}
export default AudioAnalyzer;

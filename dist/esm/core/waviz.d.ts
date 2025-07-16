import Input from "../input/input";
import AudioAnalyzer from "../analysers/analyzer";
import Visualizer from "../visualizers/Visualizer";
type AudioSourceType = HTMLAudioElement | MediaStream | 'microphone' | 'screenAudio' | string;
declare class Waviz {
    input: Input;
    audioAnalyzer: AudioAnalyzer;
    visualizer: Visualizer | null;
    isInitialized: boolean;
    constructor(canvas?: HTMLCanvasElement, audioSource?: AudioSourceType, audioContext?: AudioContext);
    private setupAudioAnalysis;
    getFrequencyData(): Uint8Array<ArrayBuffer>;
    getTimeDomainData(): Uint8Array<ArrayBuffer>;
    cleanup(): void;
    wave(options?: any): Promise<void>;
    bar(options?: any): Promise<void>;
}
export default Waviz;

import Input from '../input/input';
import AudioAnalyzer from '../analysers/analyzer';
import Visualizer from '../visualizers/visualizer';
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
    render(options?: any): Promise<void>;
    stop(): void;
    simpleLine(options?: any): Promise<void>;
    simpleBars(options?: any): Promise<void>;
    simplePolarLine(options?: any): Promise<void>;
    simplePolarBars(options?: any): Promise<void>;
}
export default Waviz;

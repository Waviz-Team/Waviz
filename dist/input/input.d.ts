import type { ChangeEvent } from 'react';
declare global {
    interface DisplayMediaStreamOptions {
        preferCurrentTab?: boolean;
    }
}
type AudioSourceType = HTMLAudioElement | MediaStream | 'microphone' | 'screenAudio' | string;
declare class Input {
    file: File | null;
    audioContext: AudioContext | null;
    sourceNode: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null;
    onAudioReady: ((source: AudioNode) => void) | null;
    pendingAudioSrc: AudioSourceType | null;
    isWaitingForUser: boolean;
    constructor(onAudioReady?: (source: AudioNode) => void, audioContext?: AudioContext);
    connectAudioSource(audioSource: AudioSourceType): Promise<void>;
    private manageAudioContext;
    private connectToAudioElement;
    private connectToMediaStream;
    loadAudioFile: (event: ChangeEvent<HTMLInputElement>) => void;
    private connectToAudioURL;
    connectToHTMLElement: (audioEl: any) => void;
    initializePending(): Promise<void>;
    private connectToMicrophone;
    private connectToScreenAudio;
    getSourceNode(): MediaElementAudioSourceNode | MediaStreamAudioSourceNode;
    getAudioContext(): AudioContext;
    cleanup(): void;
}
export default Input;

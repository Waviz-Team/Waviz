import React from 'react';
import type { ChangeEvent } from 'react';

type AudioSourceType = HTMLAudioElement | MediaStream | 'microphone' | 'screenAudio' | string;

class Input {
    file: File | null;
    audioContext: AudioContext | null;
    sourceNode: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null;
    onAudioReady: ((source: AudioNode) => void) | null;
    pendingAudioSrc: AudioSourceType | null = null;
    isWaitingForUser: boolean = false;
    
    constructor(onAudioReady?: (source: AudioNode) => void) {
        this.file = null;
        this.audioContext = null;
        this.onAudioReady = onAudioReady || null; // Needed to store callback function we'll pass in
    }

    //* Audio Source Router
    async connectAudioSource(audioSource: AudioSourceType) {
        try {
            if (audioSource === 'microphone' || audioSource === 'screenAudio') { // Needed as async for dynamic loading
                this.pendingAudioSrc = audioSource;
                this.isWaitingForUser = true;
                return;
            } else if (typeof audioSource === 'string') { // Treat as URL/source path
                this.connectToAudioURL(audioSource);
            } else if (audioSource instanceof HTMLAudioElement) { // HTML property coming in. //! Needs to be instanceOf since these properties are objects
                this.connectToHTMLElement(audioSource);
                // console.log('connecting to html')
            } else if (audioSource instanceof MediaStream) { // For browser audio stream
                this.connectToMediaStream(audioSource);
            }
        } catch (error) {
            console.error('Failed to connect audio source: ', error);
            throw error;
        }
    }

    //* Local Audio (HTML/Files/URLS) handler
    private connectToAudioElement = (audioEl) => {
        if (!audioEl) return;
        
        try { // Start with Web Audio Context to set up processing environment
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); // webkitAudioContext for older Chrome/Safari browsers. Could just use new AudioContext() if we know we're working with newer browsers only.
            this.sourceNode = this.audioContext.createMediaElementSource(audioEl); // Source node to bridge between html and WebAudioAPI
 
            if (this.onAudioReady) { // Indicate audio source is ready for analysis
                this.onAudioReady(this.sourceNode) // If callback function exists, will pass sourceNode to analyser
                this.sourceNode.connect(this.audioContext.destination);
            }; 
        } catch (error) {
            console.error('Error connecting to audio element: ', error);
        }
    }

    //* MediaStream elements handler. Works with live audio stream from microphone, screen capture, etc.
    connectToMediaStream = (stream: MediaStream) => {
        if (!stream) return;

        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.sourceNode = this.audioContext.createMediaStreamSource(stream);

            if (this.onAudioReady) {
                this.onAudioReady(this.sourceNode);
                this.sourceNode.connect(this.audioContext.destination);
            }
        } catch (error) {
            console.error('Media stream connection error: ', error)
        }
    }

    //* Local Audio methods

    // Local File input (Create new AudioElement from user upload)
    loadAudioFile = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        //TODO: include validation for mp3 here maybe? or in <input type="file" accept = ".mp3">
        if (!file)  return;

        const validType = ['audio/mp3', 'audio/mpeg']   

        if(!validType.includes(file.type)) {
          alert('Pls select an MP3 file!');
          return;
        }

        this.file = file;
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        audio.crossOrigin = "anonymous"; // Needed for CORS. Allows Web Audio API access with no credentials sent
        audio.controls = true; //! Can change. For now, set to true to view audio player controls (play/pause/volume slider).

        this.connectToAudioElement(audio);
    }

    // URL/path Input
    private connectToAudioURL(url: string) { //For URL controls
        const audio = new Audio(url);
        audio.crossOrigin = "anonymous";
        audio.controls = true;
        this.connectToHTMLElement(audio);
        
        return audio; // return needed for user control
    }

    // HTML elements input (connects to an existing HTML audio element on WebAudioAPI)
    connectToHTMLElement = (audioEl) => {
        if (!audioEl) return;

        audioEl.crossOrigin = "anonymous";

        audioEl.addEventListener('play', () => { // Auto-resume audio context
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    console.log('Input.connectToHTML has resumed play');
                })
            }
        })

        this.connectToAudioElement(audioEl);
    }

    //* MediaStream methods

    // Pending input initializer
    async initializePending() {
        if (!this.isWaitingForUser || !this.pendingAudioSrc) return;

        try {
            if (this.pendingAudioSrc === 'microphone') {
                await this.connectToMicrophone();
            } else if (this.pendingAudioSrc === 'screenAudio') {
                await this.connectToScreenAudio();
            }

            this.pendingAudioSrc = null;
            this.isWaitingForUser = false;
        } catch (error) {
            console.error('Failed to initialize pending audio source: ', error);
            throw error;
        }
    }

    // Microphone input
    private async connectToMicrophone() { 
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.connectToMediaStream(stream);
        } catch (error) {
            console.error('Error accessing microphone: ', error);
            throw error;
        }
    }

    // Screen/tab Audio
    private async connectToScreenAudio() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });

            const audioTrack = stream.getAudioTracks();
            if (audioTrack.length === 0) {
                throw new Error('No Audio Track available for screen capture');
            }

            console.log('screenaudio Data: ', audioTrack[0].label);
            this.connectToMediaStream(stream);
        } catch (error) {
            console.error('Error accessing screen audio: ', error);
        }
    }

    //* API methods
    getSourceNode() {
        return this.sourceNode;
    }

    getAudioContext() {
        return this.audioContext;
    }

    cleanup() {
        if (this.audioContext) {
            this.audioContext.close();
        }
        if (this.sourceNode) {
            this.sourceNode.disconnect();
        }
    }
}

export default Input;
import * as React from 'react';
import type { ChangeEvent } from 'react';

declare global { // Needed to extend global scope of 'DisplayMediaStreamOptions' with the currentTab that is only supported in Chromium
    interface DisplayMediaStreamOptions {
        preferCurrentTab?: boolean;
    }
}

type AudioSourceType = HTMLAudioElement | HTMLVideoElement | MediaStream | 'microphone' | 'screenAudio' | string;

class Input {
    file: File | null;
    audioContext: AudioContext | null;
    sourceNode: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null;
    onAudioReady: ((source: AudioNode) => void) | null;
    pendingAudioSrc: AudioSourceType | null = null;
    isWaitingForUser: boolean = false;
    
    constructor(onAudioReady?: (source: AudioNode) => void, audioContext?: AudioContext) {
        this.file = null;
        this.audioContext = audioContext || null;
        this.onAudioReady = onAudioReady || null; // Needed to store callback function we'll pass in
    }

    //* Audio Source Router
    async connectAudioSource(audioSource: AudioSourceType) {
        try { //? Current iteration is better for if-else. However, switch will be better for the future maybe...
            switch (true) { 
                case audioSource === 'microphone' || audioSource === 'screenAudio':
                    this.pendingAudioSrc = audioSource;
                    this.isWaitingForUser = true;
                    return; // Return to prevent recursion with case (audioSource = string) since these sources are technically strings as well

                case audioSource instanceof MediaStream: // Needed in case people want to directly pass in a mediastream instead. User should ideally use one of our methods above since they have better checks. 
                    this.pendingAudioSrc = audioSource;
                    this.isWaitingForUser = true;
                    return;
                
                case typeof audioSource === 'string':
                    this.connectToAudioURL(audioSource);
                    return; // Since all cases here should break out of the switch, all cases changed to return instead of breaks

                case audioSource instanceof HTMLAudioElement:
                case audioSource instanceof HTMLVideoElement: //! Could combine these two to be an HTMLMediaElement but I'm worried about edge cases. Could also separate these two into independent but not as DRY.
                    this.connectToHTMLElement(audioSource);
                    return;

                default:
                    throw new Error(`Unsupported media/audio source type: ${typeof audioSource}`);
            }
        } catch (error) {
            console.error('Failed to connect audio source: ', error);
            throw error;
        }
    }

    //* Audio Context manager
    private manageAudioContext() { // Helps modularize audioContext state as well as allows for re-use of audioContext
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); // webkitAudioContext for older Chrome/Safari browsers. Could just use new AudioContext() if we know we're working with newer browsers only.
        }
        return this.audioContext;
    }

    //* Local Audio (HTML/Files/URLS) handler
    private connectToAudioElement = (mediaEl) => { // Can handle both audio and video audio!
        if (!mediaEl) return;
        
        try { // Start with Web Audio Context to set up processing environment
            this.audioContext = this.manageAudioContext();
            this.sourceNode = this.audioContext.createMediaElementSource(mediaEl); // Source node to bridge between html and WebAudioAPI
 
            if (this.onAudioReady) { // Indicate audio source is ready for analysis
                this.onAudioReady(this.sourceNode) // If callback function exists, will pass sourceNode to analyser
                this.sourceNode.connect(this.audioContext.destination);
            }; 
        } catch (error) {
            console.error('Error connecting to audio element: ', error);
        }
    }

    //* MediaStream elements handler. Works with live audio stream from microphone, screen capture, etc.
    private connectToMediaStream = (stream: MediaStream) => {
        if (!stream) return;

        try {
            this.audioContext = this.manageAudioContext();
            this.sourceNode = this.audioContext.createMediaStreamSource(stream);

            if (this.onAudioReady) {
                this.onAudioReady(this.sourceNode);
            }
        } catch (error) {
            console.error('Media stream connection error: ', error)
        }
    }

    //* Local Audio methods

    // Local File input (Create new AudioElement from user upload)
    loadAudioFile = (event: ChangeEvent<HTMLInputElement>) => { //! Test local files
        const file = event.target.files?.[0];
        //TODO: include validation for mp3 here maybe? or in <input type="file" accept = ".mp3">
        if (!file)  return;

        const validType = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg'];   

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
    connectToHTMLElement = (mediaEl: HTMLAudioElement | HTMLVideoElement) => {
        if (!mediaEl) return;

        mediaEl.crossOrigin = "anonymous";

        mediaEl.addEventListener('play', () => { // Auto-resume audio context
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    console.log('Input.connectToHTML has resumed play');
                })
            }
        })

        this.connectToAudioElement(mediaEl);
    }

    //* MediaStream methods

    // Pending input initializer
    async initializePending() { // Needed because user Gesture is needed by CORS before connecting Vis with audioContext
        if (!this.isWaitingForUser || !this.pendingAudioSrc) return;

        const src = this.pendingAudioSrc;
        this.pendingAudioSrc = null; // moved to the top instead of within the Try to avoid duplicate prompts for permission
        this.isWaitingForUser = false;

        try {
            if (src === 'microphone') {
                await this.connectToMicrophone();
            } else if (src === 'screenAudio') {
                await this.connectToScreenAudio();
            } else if (src instanceof MediaStream) {
                try {
                    this.connectToMediaStream(src);
                } catch (error) {
                    console.error('Error connecting MediaStream Element: ', error);
                    throw error;
                }
            }
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
    private async connectToScreenAudio() { //! Currently only works for Chromium browsers!
        try {
            // Firefox/Safari browser checks since these two browsers currently do not support this feature. May remove these warnings once features are supported. Edge/Chrome supports getDisplayMedia.
            const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
            const isSafari = navigator.userAgent.toLowerCase().includes('safari') && !navigator.userAgent.toLowerCase().includes('chrome');
            if (isFirefox) {
                console.warn('Screen audio capture is currently not supported in Firefox.');
            }
            if (isSafari) {
                console.warn('Screen audio capture is not currently supported by Safari.');
            }

            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
                preferCurrentTab: true, // This actually does exist for Chromium + Safairi/Firefox, however TypeScript does not accept it...
            });

            const audioTracks = stream.getAudioTracks();
            const videoTracks = stream.getVideoTracks();
            console.log('AudioTracks: ', audioTracks);
            console.log('VideoTracks: ', videoTracks);

            if (audioTracks.length === 0) {
                videoTracks.forEach(track => track.stop()); // Stops the video recording that is being done. Also removes tracking indicator. 
                throw new Error('No Audio Track available for screen capture');
            }

            audioTracks.forEach((track, index) => {
                console.log(`Audio track ${index}: `, {
                    label: track.label,
                    enabled: track.enabled,
                    readyState: track.readyState,
                    settings: track.getSettings()
                });
            });

            videoTracks.forEach(track => track.stop());
            this.connectToMediaStream(stream);
            
        } catch (error) {
            console.error('Error accessing screen audio: ', error);
            throw error;
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
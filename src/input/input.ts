import React from 'react';

class Input {
    file: File | null;
    audioContext: AudioContext | null;
    sourceNode: MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null;
    onAudioReady: ((source: AudioNode) => void) | null;
    
    constructor(onAudioReady?: (source: AudioNode) => void) {
        this.file = null;
        this.audioContext = null;
        this.onAudioReady = onAudioReady || null; // Needed to store callback function we'll pass in
    }

    //* File Inputs
    loadAudioFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0] ;
        //TODO: include validation for mp3 here maybe? or in <input type="file" accept = ".mp3">
        if (!file)  return;

        const validType = ['audio/mp3', 'audio/mpeg']   

        if(!validType.includes(file.type)) {
          alert('Pls select an MP3 file!')
          return
        }

        this.file = file;
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        audio.crossOrigin = "anonymous"; // Needed for CORS. Allows Web Audio API access with no credentials sent
        audio.controls = true; //! Can change. For now, set to true to view audio player controls (play/pause/volume slider).

        this.connectToAudioElement(audio)
        
    }

    //* Audio elements from Web Audio API
    connectToAudioElement = (audioEl) => {
        if (!audioEl) return;
        
        try { // Start with Web Audio Context to set up processing environment
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)(); // webkitAudioContext for older Chrome/Safari browsers. Could just use new AudioContext() if we know we're working with newer browsers only.
            this.sourceNode = this.audioContext.createMediaElementSource(audioEl); // Source node to bridge between html and WebAudioAPI
            // console.log(source);
            
            this.sourceNode.connect(this.audioContext.destination); // Needed to connect to destination so audio still plays normally (since web Audio API hijacks signal). (.connect) comes from audioNode MediaElementSourceNode node
            
            if (this.onAudioReady) { // Indicate audio source is ready for analysis
                this.onAudioReady(this.sourceNode) // If callback function exists, will pass sourceNode to analyser
            }; 
        } catch (error) {
            console.error('Error connecting to audio element:', error);
        }
    }

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
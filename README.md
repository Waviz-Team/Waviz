# 🎧 Waviz

Waviz is a modern, modular React library for audio and signal visualization. Designed to fill the gap left by outdated or deprecated alternatives, Waviz helps developers build beautiful, customizable sound visualizations with ease.

⸻

## 🚀 Overview

Waviz provides plug-and-play React components for audio visualization, including waveform and bar visualizers. Whether you’re building a music player, educational app, or audio signal monitor, Waviz gives you the tools to integrate dynamic visuals quickly and cleanly.

⸻

## ✨ Features
* 🎵 File reading
* 📊 Audio visualization (waveform and bars)
* 🎛️ Component presets and styling options

⸻

## 🧱 Architecture

Waviz uses a modular architecture with single-responsibility function nodes:

* ✅ Clean separation of concerns
* 🔄 Easy to extend and maintain
* 🧩 Built for composability

⸻

## How to use

⸻

### Waviz Class
The purpose of the Waviz class is to provide a wrapper class for all the modularized classes we have defined below (input, analyzer, visualizer) through class composition. If you want a simple, effective way to create a visualizer that isn't a react component, use this class! The Waviz class takes in 3 optional arguments: 
* canvas - type should be an HTML Canvas Element. We need a provided user canvas to draw our visualizer on! 
* audioSource - type will be the same type defined in the Input class .connectAudioSource() below. This is necessary as well if you want to start the visualizer!
* audioContext - type will be an AudioContext. This is the currently the only optional parameter that is not needed to start the visualizer. However, if an audioContext has already been established and you don't want to duplicate audioContext (you probably shouldn't), then you can pass in your already existing audioContext. This is also helpful in the case you want to create multiple visualizers on the same page. 
All 3 arguments are not needed to initialize the class. However, the first two (canvas, audioSource) should be passed in if you want to start the visualizer. Using these arguments, the Waviz class will auto intialize the visualizer/audioContext for you. 

### Methods
**Delegator Methods:**
* getFrequencyData() - pulls the frequency data while providing sanity checks. For more details, refer to our audioAnalyzer documentation!
* getTimeDomainData() - pulls the time domain data while providing sanity checks. For more details, refer to our audioAnalyzer documentation!
* cleanup() - delgation of the cleanup from our Input class with sanity checks. This will clean up the audioContext and disconnect the sourceNode. 

**Convenience Methods:**
* wave() - takes in the optional arguments of options (for the full list of options, refer to the visualizer documentation!). This will initialize the wave visualizer for you. ***If using mediaStream inputs, make sure to call within an event listener tied to a user gesture to stay in line with CORS policy!***
* bar() - takes in the optional arguments of options (for the full list of options, refer to the visualizer documentation!). This will intialize the bar visualizer for you. ***If using mediaStream inputs, make sure to call within an event listener tied to a user gesture to stay in line with CORS policy!***

⸻

### Input Class
The purpose of the Input class is to help initialize an audio analyzer as well as identify the different types of audio/signals. The Input Class takes in two optional argument: a callback and an audioContext. The callback (tailored for an audio analyzer) must be initialized in order to use the other methods. The audioContext should only be passed if an audio context has already been set up. Otherwise, our Input class will create an audioContext by default for the user. ***If using mediaStream methods, make sure to call on them within an event listener tied to a user gesture to stay in line with CORS policy!***

### Methods
**connectAudioSource():** A router that takes in an audioSource as an argument. This will route the audio to correct managers that we have pre-defined. The current audio supported are: 
* HTML Audio elements (defined as a HTML Audio Element)
* Local File inputs 
* URL/path strings to media files (defined as a string path)
* Microphone (defined by 'microphone') - This will require user permission for microphone access of the tab.
* Tab Audio (defined by 'screenAudio')- ***Warning: This feature is currently only supported by Chromium Browsers. It will require user permission for screen video capture of the tab. Will only capture current tab.***
* MediaStream input (defined by an await statement of a mediaStream) - Highly recommend only using pre-defined methods if it exists for the mediaStream. This input will not have sanity checks and is here for edge cases/more flexibility and control for the user. 

**Handlers:** We currently have two primary handlers for an audio input.
* connectToAudioElement() - takes in an audio element as an argument. This will handle local files, htmls, and URL strings/paths to audio.
* connectToMediaStream() - takes in a stream element as an argument. This will handle all mediaStream connections.

**initializePending():** This method is important for waiting for the async user permissions (for media streams). Without this wait, a connection will be set up without waiting for permission, leading to a permanent suspended audio context. 
* Make sure to call this method before calling a visualizer function to prevent problem listed above!
* This method also acts as a middleware router for Microphone and screenAudio!

**Local audio methods. All methods here route to connectToAudioElement**
* loadAudioFile() - takes in an event from an event handler and routes to the handler. 
* connectToAudioURL() - takes in a string. String should point to the path of an audio file. 
* connectToHTMLElement() - takes in an existing HTML audio element to process through WebAudioAPI. It is currently tied to an event listener listening for 'play' to resume audio context. 

**MediaStream methods. All methods here route to connectToMediaStream():**
* connectToMicrophone() - is routed from initalizePending(). Sets up access to user microphone in the browser. *is supported by most modern browsers (chrome, firefox, safari, edge)*
* connectToScreenAudio() - is routed from intializePending(). Sets up access to user tab audio via getDisplayMedia(). It is limited to the tab in which the application is contained within. It does this by grabbing video access, and then turning off video while keeping audio from the video feed. Without this, audio cannot be grabbed. This feature is only supported by Chromium Browsers. 

**API Methods:**
* getSourceNode() - if you want to figure out which sourceNode is being passed in
* getAudioContext() - to get the current used audioContext
* cleanup() - this will clear the current audioContext and disconnect the sourceNode. To reaccess features, a re-intialization of the audioContext/sourceNode will be necessary. 

⸻

### AudioAnalyzer Class
The purpose of the analyzer class is to provide an in-house analyzer for audio data while maintaining a clear separation of concerns. The analyzer uses methods pre-defined on webAudio API to conduct Fourier transformations on a given audio context. startAnalysis takes two mandatory arguments: audioContext and sourceNode. sourceNode must be an AudioNode that we can connect to in order to run the analysis. 

### Methods
**startAnalysis():** The primary method of the audioAnalyzer class. It will run a Fourier analysis on the audioContext using .createAnalyser() defined by WebAudioApi. By default, it will take a fftSize of 2048. *Future Update: Allow users to dynamically change fftSize!*

**API Methods:**
* getFrequencyData() - allows users/functions to pull the array of frequency data mapped by FFT in bins to access. The array will be of type 8-bit unsigned integers with an array length of 1/2 the fftSize. 
* getTimeDomainData() - allows users/functions to pull the array of time mapped data by FFT in bins to access. The array will be of type 8-bit unsigned integers with an array length of 1/2 the fftSize.
* getDataArray() - allows users/functions to grab the raw freq data in type 8-bit unsigned integers. 
* getBufferLength() - this will output the frequency bin count. This will be 1/2 of the fftSize and is functionally the same as getDataArray() without being in type 8-bit unsigned.
* get timeData() - a getter function that outputs the same result as getTimeDomainData(). This is here in case users want to access live data via a getter function instead. 
* get freqData() - a getter function that outputs the same result as getFrequencyData(). This is here in case users want to access live data via a getter function instead. 

⸻

### Visualizer Class
Coming Soon!

⸻

## 📦 Installation (coming soon)

```
npm install waviz
```

⸻

## 🤝 Contributing

We welcome contributions! Whether you’re fixing bugs, adding features, or improving docs, feel free to open an issue or PR.

⸻

## 📄 License

MIT © OSP Team 1

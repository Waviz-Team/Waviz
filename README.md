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

### Input
The purpose of the Input class is to help initialize an audio analyzer as well as identify the different types of audio/signals. The Input Class takes in two optional argument: a callback and an audioContext. The callback (tailored for an audio analyzer) must be initialized in order to use the other methods. The audioContext should only be passed if an audio context has already been set up. Otherwise, our Input class will create an audioContext by default for the user. 

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

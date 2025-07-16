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
* connectToAudioElement() - takes in an audio element as an argument. This will handle local files, htmls, and URL strings/paths to audio 

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

# 🎧 Waviz

Waviz is a modern, modular React library for audio and signal visualization. Designed to fill the gap left by outdated or deprecated alternatives, Waviz helps developers build beautiful, customizable sound visualizations with ease.



## 🚀 Overview

Waviz provides plug-and-play React components for audio visualization, including waveform and bar visualizers. Whether you’re building a music player, educational app, or audio signal monitor, Waviz gives you the tools to integrate dynamic visuals quickly and cleanly.



## ✨ Features
* 🎵 File reading, MediaStream reading 
* 📊 Audio visualization (waveform, bars, dots, particles)
* 🎛️ Component presets and styling options



## 🧱 Architecture

Waviz uses a modular architecture with single-responsibility function nodes:

* ✅ Clean separation of concerns
* 🔄 Easy to extend and maintain
* 🧩 Built for composability

## 📦 Installation 

```
npm i waviz
```



## 📚 Library
![Waviz Library](public/readMe/WavizLibraries.png)

Waviz has two primary libraries: 
* Waviz Core
* Plug n Play

If you want a simple plug-in and use React Components, go to our (Plug & Play React Components section). Plug n Play uses the Waviz Core Library to generate presets. 

If you want to have more control over what you build, go to our (Waviz Core Section). Waviz Core uses Web Audio API and HTML Canvas to generate a visualizer. 

For a more in-depth documentation, visit our website/docs: [www.ipsemLorum.com](www.ipsemLorum.com)

## Waviz Core

Waviz Core has 3 primitive classes: 
* Input
* Analyzer
* Visualizer

While they are designed to work together, each of these classes can be used independently. The basic flow of data is: Input -> Analyzer -> Visualizer. 

![coreStructure](public/readMe/coreStructure.png)

If you want to use all three classes in tandem, we have a composition class 'Waviz' that you can initialize.

### Waviz Class
The Waviz class is the 'wrapper' class that uses all three primitive classes to initialize a visualizer. This is the recommended class to get started if you are using the Core Library. 

The Waviz class takes in three arguments: 
* HTML Canvas element
* Audio Source
* Audio Context

While all three arguments are optional, an Audio Source and a HTMLCanvas are the bare minimum needed to initialize a visualizer. The Audio Source argument should only be passed in if you have already established an AudioContext. 

To get started, make sure to intialize the waviz class passing in an Audio Source and a HTML Canvas element:
```ts
const wavizTest = new Waviz(canvas, audio);
```

From here, you can call your visualize within a relevant event listener. Because of browser protection policies, you cannot initialize a visualizer without tying it to a user gesture. 
```ts
wavizTest.visualizer.simpleBars();
```

If you are using a media stream element (microphone, tab audio, etc), you need to also intialize the pending method. This will ensure that the visualizer waits for user permissions before continuing forward. It is recommended that regardless of what input element you are using, you always intialize pending. This will be an async call so make sure you call this within an asynchronous function. 
```ts
await wavizTest.input.initializePending();
```

The recommended initialization should look like so: 

```tsx
const wavizTest = new Waviz(canvas, audio);

audio.addEventListener('play', async () => {
    await wavizTest.input.initializePending(); 
    wavizTest.visualizer.simpleBars();
});

audio.addEventListener('pause', () => {
  wavizTest.visualizer.stop();
});
```

### Input Class
The Input class handles the 'preparation' of the audio inputs you would like to use. It takes in a callback function (to initialize source nodes) and an optional AudioContext. The current inputs supported are: 
* HTML Audio elements (defined as a HTML Audio Element)
* HTML Video elements (defined as a HTML Video Element)
* Local File inputs
* URL/path strings to media files (defined as a string path)
* Microphone (defined by 'microphone') - This will require user permission for microphone access of the tab.
* Tab Audio (defined by 'screenAudio')- Warning: This feature is currently only supported by Chromium Browsers. It will require user permission for screen video capture of the tab. Will only capture current tab. This may change in the future. Refer to MDN docs for up-to-date support: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
MediaStream input (defined by an await statement of a mediaStream) 

An example initlaization of the input class will look like such: 
```ts
this.input = new Input((sourceNode) => {
    this.setupAudioAnalysis(sourceNode);
}, audioContext);
```

Refer to our [www.ipsemLorum.com](www.ipsemLorum.com) for more detailed information on the Input methods and handling.

### Analyzer Class
The Analyzer class is the primary handler of transforming an input into a readable data frequency. The analyzer class does not take in any arguments; however, it needs to be initiated via the 'startAnalysis' method - a function that takes in an AudioContext and a sourceNode. 

```ts
const testAnalyzer = new AudioAnalyzer();
testAnalyzer.startAnalysis(audioContext, sourceNode);
```

Once an analysis has been started, you can grab the frequency domain data or time domain data using the getFrequencyData and getTimeDomainData methods. 

```ts
const frequencyData = analyzer.getFrequencyData();
const timeDomainData = analyzer.getTimeDomainData();
```

### Visualizer Class
The visualizer class is the engine of our visualization. It paints 2d visualizations by taking in a HTML Canvas Element and a Uint8Array (or our audioAnalyzer instance).

**Key Features:**
* Supports multiple visualization types: lines, bars, dots, particles, and more
* Works with both time and frequency domain data
* Customizable colors, gradients, and styles

**Basic Usage:**

```ts
import Visualizer from './src/visualizers/visualizer';
import AudioAnalyzer from './src/analysers/analyzer';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const audioContext = new AudioContext();
const audioElement = document.getElementById('audio') as HTMLAudioElement;
const sourceNode = audioContext.createMediaElementSource(audioElement);

const analyzer = new AudioAnalyzer();
analyzer.startAnalysis(audioContext, sourceNode);

const visualizer = new Visualizer(canvas, analyzer);
visualizer.simpleLine('#3498db'); // Draws a simple blue waveform line
```

For more advanced options and layering, see the [Visualizer Documentation](doc/VisualizerDocs.md).

## Plug & Play React Components
Waviz offers easy-to-use, plug-and-play React components for rapid integration of audio visualizations into your React applications. 

**Key Features:**
* Simple React props API—just provide an audio source and (optionally) a canvas ref
* Supports multiple visualization types and presets
* Fully compatible with React functional components and hooks

**Basic Usage:**

To use, make sure you establish a useRef( ) for the audio. The canvas useRef ( ) can be optional but for the most control over the size, it is recommended that you create a canvas that will be passed down. 

```tsx
import React, { useRef } from 'react';
import { Mixed3 } from 'waviz';

export default function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div>
      <Mixed3 srcAudio={audioRef} srcCanvas={canvasRef} />
      <canvas ref={canvasRef} width={400} height={400}></canvas>
      <audio ref={audioRef} src="/your-audio-file.mp3" controls />
    </div>
  );
}
```

Just like from the Input class, you can also initialize the visualizer using mediaStream inputs instead. You would set the useRef directly at the top instead of assigning it to the audio. 

```ts
const audioRef = useRef('screenAudio')
```

**Available Components:**
- `Bars` - 6 different presets of Bar visualization
- `Waves` - 7 different presets of Wave visualization
- `Dots` - 4 different presets of Dots visualization
- `Particles` - 1 preset using Particle visualization
- `Mixed` – Flexible visualizer supporting multiple styles and layer

More component presets will be added in the future! Each component is organized via a number system. For instance for Dots, the imports for each would be as such: 

```tsx
import { Dots1 } from 'waviz';
import { Dots2 } from 'waviz';
import { Dots3 } from 'waviz';
import { Dots4 } from 'waviz';
```

For advanced configuration and customization, check out the [components documentation](./components/README.md).



## 🤝 Contributing

We welcome contributions! Whether you’re fixing bugs, adding features, or improving docs, feel free to open an issue or PR.


## 📄 License

MIT © 2025 Waviz Team

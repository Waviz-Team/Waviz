(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Waviz = {}));
})(this, (function (exports) { 'use strict';

    class Input {
        constructor(onAudioReady, audioContext) {
            this.pendingAudioSrc = null;
            this.isWaitingForUser = false;
            //* Local Audio (HTML/Files/URLS) handler
            this.connectToAudioElement = (mediaEl) => {
                if (!mediaEl)
                    return;
                try { // Start with Web Audio Context to set up processing environment
                    this.audioContext = this.manageAudioContext();
                    this.sourceNode = this.audioContext.createMediaElementSource(mediaEl); // Source node to bridge between html and WebAudioAPI
                    if (this.onAudioReady) { // Indicate audio source is ready for analysis
                        this.onAudioReady(this.sourceNode); // If callback function exists, will pass sourceNode to analyser
                        this.sourceNode.connect(this.audioContext.destination);
                    }
                    ;
                }
                catch (error) {
                    console.error('Error connecting to audio element: ', error);
                }
            };
            //* MediaStream elements handler. Works with live audio stream from microphone, screen capture, etc.
            this.connectToMediaStream = (stream) => {
                if (!stream)
                    return;
                try {
                    this.audioContext = this.manageAudioContext();
                    this.sourceNode = this.audioContext.createMediaStreamSource(stream);
                    if (this.onAudioReady) {
                        this.onAudioReady(this.sourceNode);
                    }
                }
                catch (error) {
                    console.error('Media stream connection error: ', error);
                }
            };
            //* Local Audio methods
            // Local File input (Create new AudioElement from user upload)
            this.loadAudioFile = (event) => {
                var _a;
                const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
                //TODO: include validation for mp3 here maybe? or in <input type="file" accept = ".mp3">
                if (!file)
                    return;
                const validType = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
                if (!validType.includes(file.type)) {
                    alert('Pls select an MP3 file!');
                    return;
                }
                this.file = file;
                const audio = new Audio();
                audio.src = URL.createObjectURL(file);
                audio.crossOrigin = "anonymous"; // Needed for CORS. Allows Web Audio API access with no credentials sent
                audio.controls = true; //! Can change. For now, set to true to view audio player controls (play/pause/volume slider).
                this.connectToAudioElement(audio);
            };
            // HTML elements input (connects to an existing HTML audio element on WebAudioAPI)
            this.connectToHTMLElement = (mediaEl) => {
                if (!mediaEl)
                    return;
                mediaEl.crossOrigin = "anonymous";
                mediaEl.addEventListener('play', () => {
                    if (this.audioContext.state === 'suspended') {
                        this.audioContext.resume().then(() => {
                            console.log('Input.connectToHTML has resumed play');
                        });
                    }
                });
                this.connectToAudioElement(mediaEl);
            };
            this.file = null;
            this.audioContext = audioContext || null;
            this.onAudioReady = onAudioReady || null; // Needed to store callback function we'll pass in
        }
        //* Audio Source Router
        async connectAudioSource(audioSource) {
            console.log("The audioSource in input is : ", audioSource);
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
            }
            catch (error) {
                console.error('Failed to connect audio source: ', error);
                throw error;
            }
        }
        //* Audio Context manager
        manageAudioContext() {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)(); // webkitAudioContext for older Chrome/Safari browsers. Could just use new AudioContext() if we know we're working with newer browsers only.
            }
            return this.audioContext;
        }
        // URL/path Input
        connectToAudioURL(url) {
            const audio = new Audio(url);
            audio.crossOrigin = "anonymous";
            audio.controls = true;
            this.connectToHTMLElement(audio);
            return audio; // return needed for user control
        }
        //* MediaStream methods
        // Pending input initializer
        async initializePending() {
            if (!this.isWaitingForUser || !this.pendingAudioSrc)
                return;
            const src = this.pendingAudioSrc;
            this.pendingAudioSrc = null; // moved to the top instead of within the Try to avoid duplicate prompts for permission
            this.isWaitingForUser = false;
            try {
                if (src === 'microphone') {
                    await this.connectToMicrophone();
                }
                else if (src === 'screenAudio') {
                    await this.connectToScreenAudio();
                }
                else if (src instanceof MediaStream) {
                    try {
                        this.connectToMediaStream(src);
                    }
                    catch (error) {
                        console.error('Error connecting MediaStream Element: ', error);
                        throw error;
                    }
                }
            }
            catch (error) {
                console.error('Failed to initialize pending audio source: ', error);
                throw error;
            }
        }
        // Microphone input
        async connectToMicrophone() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.connectToMediaStream(stream);
            }
            catch (error) {
                console.error('Error accessing microphone: ', error);
                throw error;
            }
        }
        // Screen/tab Audio
        async connectToScreenAudio() {
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
            }
            catch (error) {
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

    class AudioAnalyzer {
        constructor() {
            this.dataArray = null;
            this.frequencyDataArray = null;
            this.timeDomainDataArray = null;
            this.bufferLength = null;
            this.analyserNode = null;
        }
        startAnalysis(audioContext, sourceNode) {
            if (!audioContext) { // Error handler for missing Audio Context
                console.error('Audio Context not found');
                return;
            }
            if (!sourceNode) {
                console.error('Source node not found');
                return;
            }
            this.analyserNode = audioContext.createAnalyser(); //needed to access properties
            if (audioContext.state === 'suspended') { //! Perhaps not needed. Testing required. 
                audioContext.resume().then(() => {
                    console.log('DEV: Audio context force started');
                });
            }
            this.analyserNode.fftSize = 2048; //TODO: Maybe allow users to set this (common vals: 256, 512, 1024, 2048+)
            this.bufferLength = this.analyserNode.frequencyBinCount; // = 1/2 of fftsize
            this.dataArray = new Uint8Array(this.bufferLength); // Array of bufferlength freq values (or bins)
            this.frequencyDataArray = new Uint8Array(this.bufferLength);
            this.timeDomainDataArray = new Uint8Array(this.bufferLength);
            // console.log(this.frequencyDataArray);
            sourceNode.connect(this.analyserNode);
        }
        getFrequencyData() {
            if (this.analyserNode && this.frequencyDataArray) {
                this.analyserNode.getByteFrequencyData(this.frequencyDataArray); // mutates dataArray
                return this.frequencyDataArray;
            }
            return null;
        }
        getTimeDomainData() {
            if (this.analyserNode && this.timeDomainDataArray) {
                this.analyserNode.getByteTimeDomainData(this.timeDomainDataArray); // mutates dataArray
                return this.timeDomainDataArray;
            }
            return null;
        }
        getDataArray() {
            return this.dataArray;
        }
        getBufferLength() {
            return this.bufferLength;
        }
        get timeData() {
            return this.getTimeDomainData() || new Uint8Array(0);
        }
        get freqData() {
            return this.getFrequencyData() || new Uint8Array(0);
        }
    }

    // Maps value to new range
    function makePeriodic(input) {
        // Linear periodic extension (this will help with closing the seam between first and last value in polar vis)
        const output = input.slice();
        const length = output.length;
        const diff = output[length - 1] - output[0];
        for (let i = 0; i < length; i++) {
            output[i] -= (diff * i) / (length - 1); // output[0] === output[len-1]
        }
        return output;
    }
    //* Window Functions
    function hanWindow(input) {
        // Hann window (used to reduce spectral leakage through a bell-shaper curve tapering)
        const N = input.length;
        return input.map((v, n) => v * (0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (N - 1))));
    }
    function hammingWindow(input) {
        // Hamming window (similar to hanning but with slightly modified weighting for side lobes. Useful for higher frequency resolution)
        const N = input.length;
        return input.map((v, n) => v * (0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1))));
    }
    function exponentialWindow(input, a = 0.01) {
        // Exponential Window (used in modal impact testing+ where emphaisis on beginning of signal is important. Good for analyzing transient signals)
        return input.map((v, n) => v * Math.exp(-a * n));
    }
    function blackmanHarrisWindow(input) {
        // General purpose Window good for suppressing sidelobes
        const N = input.length;
        // Default Values taken from https://www.mathworks.com/help/signal/ref/blackmanharris.html
        const a0 = 0.35875;
        const a1 = 0.48829;
        const a2 = 0.14128;
        const a3 = 0.01168;
        return input.map((v, n) => v *
            (a0 -
                a1 * Math.cos((2 * Math.PI * n) / (N - 1)) +
                a2 * Math.cos((4 * Math.PI * n) / (N - 1)) -
                a3 * Math.cos((6 * Math.PI * n) / (N - 1))));
    }
    const windowFunc = {
        hann: hanWindow,
        hamming: hammingWindow,
        exponential: exponentialWindow,
        bHarris: blackmanHarrisWindow,
    };

    // Visualizer class
    class Visualizer {
        constructor(canvas, data) {
            this.frame = 0;
            //Inputs check
            if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
                console.log('No valid canvas provided');
                return;
            }
            if (!data || !(data instanceof AudioAnalyzer)) {
                console.log('No valid data provided');
                return;
            }
            // Class variables
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.data = data;
        }
        // Data tools
        dataPreProcessor(dataType = 'time', amplitude = 100, range = 1024, windowName //? Q mark added here since windowName shouldn't be in freq
        ) {
            let data;
            // Select data type - 'fft' or 'time'
            switch (dataType) {
                case 'freq':
                    data = this.data.freqData;
                    break;
                case 'time':
                    data = this.data.timeData;
                    break;
            }
            // Normalize data
            const normalized = Array.from(data).map((e) => e / 255);
            // Amplitude and range control
            let processedData = normalized
                .map((e) => {
                return (e - 0.5) * amplitude;
            })
                .slice(0, range);
            if (dataType === 'time' && windowName) {
                switch (windowName.toLowerCase()) {
                    case 'hanning':
                    case 'hann':
                        processedData = windowFunc.hann(processedData);
                        break;
                    case 'hamming':
                        processedData = windowFunc.hamming(processedData);
                        break;
                    case 'exponential':
                    case 'exp':
                        processedData = windowFunc.exponential(processedData);
                        break;
                    case 'blackman-harris':
                    case 'bharris':
                    case 'blackmanh':
                        processedData = windowFunc.bHarris(processedData);
                        break;
                }
            }
            return processedData;
        }
        // Data Transforms
        dataToRect(input) {
            const width = this.canvas.width;
            const height = this.canvas.height;
            const rectData = [];
            input.forEach((e, i) => {
                const x = (i / input.length) * width;
                const y = height / 2 + e;
                rectData.push([x, y]);
            });
            return rectData;
        }
        dataToPolar(input, radius = 100, angle = 0, autoRotate = 0) {
            const rotation = (angle * Math.PI) / 180 + (this.frame * autoRotate) / 100;
            const polarData = [];
            const periodicData = makePeriodic(input); // this can be moved into an option later if needed. Right now, forces linear tilt on polar to smooth out end/beginning seam
            periodicData.forEach((e, i, a) => {
                e += radius;
                const angle = -(i * (Math.PI * 2)) / a.length;
                const x = e * Math.cos(angle + rotation);
                const y = e * Math.sin(angle + rotation);
                polarData.push([x + this.canvas.width / 2, y + this.canvas.height / 2]);
            });
            return polarData;
        }
        // Drawing tools
        particles(data, velocity = [1, 1], gravity = 1, lifespan = Infinity, birthrate = 1, samples = 100) {
            const frame = this.frame;
            class particle {
                constructor(position, velocity, gravity, canvas) {
                    this.live = true;
                    this.born = frame;
                    this.canvasSize = [canvas.width, canvas.height];
                    this.position = position;
                    this.velocity = [
                        (Math.random() - 0.5) * velocity[0],
                        (Math.random() - 0.5) * velocity[1],
                    ];
                    this.gravity = gravity;
                }
                // Particle update method
                update() {
                    // Update velocity
                    this.velocity = [this.velocity[0], this.velocity[1] + this.gravity];
                    // Update position
                    const x = this.position[0] + this.velocity[0];
                    const y = this.position[1] + this.velocity[1];
                    this.position = [x, y];
                    // Check if particle in canvas and kill if not
                    if (this.position[0] < 0 ||
                        this.position[0] > this.canvasSize[0] ||
                        this.position[1] < 0 ||
                        this.position[1] > this.canvasSize[1]) {
                        this.live = false;
                    }
                }
            }
            // Check if particle system exists and create one if not
            if (!this.particleSystem) {
                this.particleSystem = [];
            }
            // Set birthrate
            if (this.frame % birthrate === 0) {
                for (let i = 0; i < data.length; i += Math.round(data.length / samples)) {
                    this.particleSystem.push(new particle(data[i], velocity, gravity, this.canvas));
                }
            }
            // Particle update loop
            if (this.particleSystem) {
                this.particleSystem.forEach((e, i) => {
                    // Set lifespan
                    if (frame - e.born > lifespan) {
                        e.live = false;
                    }
                    // Update and kill particles
                    if (e.live === true) {
                        e.update();
                    }
                    else if (e.live === false || this.frame - e.born > 1) {
                        this.particleSystem.splice(i, 1);
                    }
                    // Draw Particle
                    this.ctx.roundRect(e.position[0], e.position[1], 1, 1, 1000);
                });
            }
        }
        dots(data, samples = 100) {
            // Define number of dots
            const sampling = Math.ceil(data.length / samples);
            // Draw dots
            for (let i = 0; i < data.length; i += sampling) {
                this.ctx.roundRect(data[i][0], data[i][1], 1, 1, 1000);
            }
        }
        line(data, samples = 1024) {
            // Define sampling rate for line
            const sampling = Math.ceil(data.length / samples);
            // Draw line
            this.ctx.beginPath();
            for (let i = 0; i < data.length; i += sampling) {
                if (i === 0) {
                    this.ctx.moveTo(data[i][0], data[i][1]);
                }
                else {
                    this.ctx.lineTo(data[i][0], data[i][1]);
                }
            }
        }
        bars(data, numBars = 20, mode = 'rect', innerRadius = 100) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const sampling = Math.ceil(data.length / numBars);
            this.ctx.beginPath();
            if (mode === 'polar') {
                for (let i = 0; i < data.length; i += sampling) {
                    // Calculate angle for this bar
                    const angle = -(i * 2 * Math.PI) / data.length;
                    // Inner Circle start
                    const x0 = centerX + innerRadius * Math.cos(angle);
                    const y0 = centerY + innerRadius * Math.sin(angle);
                    // End point (outerCircle End) based on data
                    let [x1, y1] = data[i];
                    // Distance calculations
                    const dx = x1 - centerX;
                    const dy = y1 - centerY;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    const magnitude = Math.abs(dist - innerRadius) + innerRadius;
                    x1 = centerX + magnitude * Math.cos(angle);
                    y1 = centerY + magnitude * Math.sin(angle);
                    this.ctx.moveTo(x0, y0);
                    this.ctx.lineTo(x1, y1);
                }
            }
            else {
                const offset = this.canvas.width / numBars / 2;
                for (let i = 0; i < data.length; i += sampling) {
                    const [x, y] = data[i];
                    this.ctx.moveTo(x + offset, this.canvas.height);
                    this.ctx.lineTo(x + offset, y);
                }
            }
        }
        // Color tools
        randomColor() {
            const r = Math.random() * 255;
            const g = Math.random() * 255;
            const b = Math.random() * 255;
            return `rgb(${r},${g},${b})`;
        }
        randomPalette(colorArray = ['#57BBDE', '#9DDE57', '#CC57DE', '#DE9C57']) {
            return colorArray[Math.round(Math.random() * colorArray.length)];
        }
        linearGradient(color1 = '#E34AB0', color2 = '#5BC4F9', flip = '') {
            let gradient;
            // Define direction of gradient
            if (flip === 'flip') {
                gradient = this.ctx.createLinearGradient(this.canvas.width / 2, 0, this.canvas.width / 2, this.canvas.height);
            }
            else {
                gradient = this.ctx.createLinearGradient(0, this.canvas.height / 2, this.canvas.width, this.canvas.height / 2);
            }
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            return gradient;
        }
        radialGradient(color1 = '#E34AB0', color2 = '#5BC4F9', innerRadius = 0, outerRadius = 250) {
            const gradient = this.ctx.createRadialGradient(this.canvas.width / 2, this.canvas.height / 2, innerRadius, this.canvas.width / 2, this.canvas.height / 2, outerRadius);
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            return gradient;
        }
        // Style Tools
        fill(vizType, fillType, fillColor, flip) {
            switch (vizType) {
                case 'rect':
                    //Close path
                    this.ctx.lineTo(this.canvas.width, this.canvas.height);
                    this.ctx.lineTo(0, this.canvas.height);
                    this.ctx.closePath();
                    //Color
                    switch (fillType) {
                        case 'solid':
                            this.ctx.fillStyle = fillColor;
                            break;
                        case 'gradient':
                            this.ctx.fillStyle = this.linearGradient(fillColor[0], fillColor[1], flip);
                            break;
                    }
                case 'polar':
                    switch (fillType) {
                        case 'solid':
                            this.ctx.fillStyle = fillColor;
                            break;
                        case 'gradient':
                            this.ctx.fillStyle = this.radialGradient(fillColor[0], fillColor[1]);
                            break;
                    }
                    this.ctx.fill();
                    break;
            }
        }
        stroke(lineWidth = 2, style = '') {
            this.ctx.lineWidth = lineWidth;
            // Fill Dashes
            if (style === 'dashes') {
                this.ctx.setLineDash([10, 10]);
            }
        }
        // TODO  Need to work on transform methods like mirror
        // Transforms
        mirror() {
            // this.ctx.rotate(Math.PI / 2);
            // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height / 2);
            // this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
            // this.ctx.translate(-150, -75);
        }
        // Render methods
        layer(options) {
            // New Path
            this.ctx.beginPath();
            // Data
            let inputData;
            let data;
            // Domain switch
            switch (options.domain[0]) {
                case 'freq':
                    inputData = this.dataPreProcessor('freq', options.domain[1], options.domain[2]);
                    break;
                case 'time':
                    inputData = this.dataPreProcessor('time', options.domain[1], options.domain[2], options.domain[3]);
                    break;
                default:
                    inputData = this.dataPreProcessor('time');
                    break;
            }
            // Coordinates switch
            switch (options.coord[0]) {
                case 'rect':
                    data = this.dataToRect(inputData);
                    break;
                case 'polar':
                    data = this.dataToPolar(inputData, options.coord[1], options.coord[2], options.coord[3]);
                    break;
                default:
                    data = this.dataToRect(inputData);
                    break;
            }
            // Vizualizer switch
            switch (options.viz[0]) {
                case 'line':
                    this.line(data, options.viz[1]);
                    break;
                case 'bars':
                    this.bars(data, options.viz[1], //numbars feature
                    options.coord[0], // mode ('rect' or 'polar') from coord
                    options.coord[1] // innerRadius from coord
                    );
                    break;
                case 'dots':
                    this.dots(data, options.viz[1]);
                    break;
                case 'particles':
                    this.particles(data, options.viz[1], options.viz[2], options.viz[3], options.viz[4], options.viz[5]);
                    break;
                default:
                    this.line(data);
                    break;
            }
            // Color switch //TODO Random per item instead of per frame
            switch (options.color[0]) {
                case 'linearGradient':
                    this.ctx.strokeStyle = this.linearGradient(options.color[1], options.color[2], options.color[3]);
                    break;
                case 'radialGradient':
                    this.ctx.strokeStyle = this.radialGradient(options.color[1], options.color[2], options.color[3], // inner radius number
                    options.color[4] // outer radius number
                    );
                    break;
                case 'randomColor':
                    this.ctx.strokeStyle = this.randomColor();
                    break;
                case 'randomPalette':
                    this.ctx.strokeStyle = this.randomPalette(options.color[1]);
                    break;
                default:
                    this.ctx.strokeStyle = options.color[0]; // Default is now the string passed in
                    break;
            }
            // Fill
            if (options.fill) {
                this.fill(options.coord[0], options.fill[0], options.fill[1], options.fill[2]);
            }
            // Stroke
            this.stroke(options.stroke[0], options.stroke[1]);
            // Transforms
            // TODO WIP
            // this.mirror();
            // Close path if polar
            // TODO Integrate this check into line method
            if (options.coord[0] === 'polar' && options.viz[0] !== 'bars') {
                this.ctx.closePath();
            }
            // Draw Path
            this.ctx.stroke();
        }
        //! RENDER
        render(options) {
            // Clear Canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Default options
            const defaults = {
                domain: ['time'],
                coord: ['rect'],
                viz: ['line', undefined, undefined, undefined, undefined, undefined],
                color: ['#E34AB0'],
                stroke: [2],
            };
            // Draw
            if (!options) {
                this.layer(defaults);
            }
            else if (Array.isArray(options)) {
                options.forEach((e) => {
                    this.layer(Object.assign({}, defaults, e));
                });
            }
            else {
                this.layer(Object.assign({}, defaults, options));
            }
            // Increment frame counter
            this.frame++;
            // Start Animation Loop
            this.renderLoop = requestAnimationFrame(this.render.bind(this, options));
        }
        stop() {
            cancelAnimationFrame(this.renderLoop);
        }
        //* Conveniency Methods
        simpleLine(options = '#E34AB0') {
            this.render({ color: [options] });
        }
        simpleBars(options = '#E34AB0') {
            this.render({
                domain: ['time', 300],
                viz: ['bars', undefined, undefined, undefined, undefined, undefined],
                color: [options],
                stroke: [30],
            });
        }
        simplePolarLine(options = '#E34AB0') {
            this.render({ coord: ['polar'], color: [options] });
        }
        simplePolarBars(options = '#E34AB0') {
            this.render({
                domain: ['time', 200],
                coord: ['polar'],
                viz: ['bars', 25],
                color: [options],
                stroke: [20],
            });
        }
    }

    class Waviz {
        constructor(canvas, audioSource, audioContext) {
            this.visualizer = null;
            this.isInitialized = false;
            // Optional canvas passthrough for params
            this.audioAnalyzer = new AudioAnalyzer();
            this.input = new Input((sourceNode) => {
                // needed because setupAudioAnalysis needs to wait for async audio source
                this.setupAudioAnalysis(sourceNode);
            }, audioContext);
            if (canvas) {
                this.visualizer = new Visualizer(canvas, this.audioAnalyzer);
            }
            if (audioSource) {
                this.input.connectAudioSource(audioSource);
            }
        }
        //* WAVIZ setup methods
        setupAudioAnalysis(sourceNode) {
            // Method to setup the Waviz audio analysis. Needed here because of async calls expected in Input. If moved up, sourceNode won't exist in time since constructor runs first.
            const audioContext = this.input.getAudioContext();
            // Analysis start
            this.audioAnalyzer.startAnalysis(audioContext, sourceNode);
            this.isInitialized = true;
        }
        //* AudioAnalyzer delegator
        getFrequencyData() {
            if (!this.isInitialized)
                return null;
            return this.audioAnalyzer.getFrequencyData();
        }
        getTimeDomainData() {
            if (!this.isInitialized)
                return null;
            return this.audioAnalyzer.getTimeDomainData();
        }
        //* Input Delegator
        cleanup() {
            this.input.cleanup();
            this.isInitialized = false;
        }
        //* Visualizer Delegator
        //* Convenience Methods Main
        async render(options) {
            await this.input.initializePending();
            this.visualizer.render(options);
        }
        stop() {
            this.visualizer.stop();
        }
        //* Conveninence Methods Presets
        async simpleLine(options) {
            await this.input.initializePending();
            this.visualizer.simpleLine(options);
        }
        async simpleBars(options) {
            await this.input.initializePending();
            this.visualizer.simpleBars(options);
        }
        async simplePolarLine(options) {
            await this.input.initializePending();
            this.visualizer.simplePolarLine(options);
        }
        async simplePolarBars(options) {
            await this.input.initializePending();
            this.visualizer.simplePolarBars(options);
        }
    }

    exports.AudioAnalyzer = AudioAnalyzer;
    exports.Input = Input;
    exports.Visualizer = Visualizer;
    exports.Waviz = Waviz;
    exports.default = Waviz;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=waviz.umd.js.map

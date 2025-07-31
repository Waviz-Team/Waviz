import AudioAnalyzer from '../analysers/analyzer';
import { windowFunc } from '../utils/mathUtils';
import { makePeriodic } from '../utils/mathUtils';
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
                default:
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
                const angle = (i * 2 * Math.PI) / data.length;
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
                    case 'linearGradient':
                        this.ctx.fillStyle = this.linearGradient(fillColor[0], fillColor[1], flip);
                        break;
                }
            case 'polar':
                switch (fillType) {
                    case 'solid':
                        this.ctx.fillStyle = fillColor;
                        break;
                    case 'radialGradient':
                        this.ctx.fillStyle = this.radialGradient(fillColor[0], fillColor[1]);
                        break;
                }
                this.ctx.fill();
                break;
            default:
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
        if (options.coord[0] === 'polar') {
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
            style: [30],
        });
    }
    simplePolarLine(options = '#E34AB0') {
        this.render({ coord: ['polar'], color: [options] });
    }
    simplePolarBars(options = '#E34AB0') {
        this.render({
            domain: ['time', 200],
            coord: ['polar'],
            viz: ['polarBars'],
            color: [options],
            style: [10],
        });
    }
}
export default Visualizer;
//# sourceMappingURL=visualizer.js.map
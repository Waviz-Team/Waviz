import AudioAnalyzer from '../analysers/analyzer';
import { mapArray } from '../utils/mathUtils';

// Interfaces and custom types
interface IParticle {
  canvasSize: number[];
  position: number[];
  velocity: number[];
  gravity: number;
  live: boolean;
  born: number;
  update(): void;
}

interface IOptions {
  domain?: [string?, number?, number?];
  coord?: [string?, number?, number?];
  viz?: [string?, number[] | number?, number?, number?, number?, number?];
  color?: [string | string[], string?, string | number, number?];
  style?: [number?, string?, string?];
}

// Visualizer class
class Visualizer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  data: AudioAnalyzer;
  renderLoop: number;
  frame: number = 0;
  particleSystem: IParticle[];

  constructor(canvas: HTMLCanvasElement, data: Uint8Array) {
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
  dataPreProcessor(
    dataType: string = 'time',
    amplitude: number = 100,
    range: number = 1024
  ) {
    let data: Uint8Array;

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
    const normalized: number[] = Array.from(data).map((e) => e / 255);

    // Amplitude and range control
    const processedData = normalized
      .map((e) => {
        return (e - 0.5) * amplitude;
      })
      .slice(0, range);

    return processedData;
  }

  // Data Transforms
  dataToRect(input: number[]) {
    const width: number = this.canvas.width;
    const height: number = this.canvas.height;
    const rectData: number[][] = [];

    input.forEach((e, i) => {
      const x = (i / input.length) * width;
      const y = height / 2 + e;
      rectData.push([x, y]);
    });
    return rectData;
  }

  dataToPolar(input: number[], radius: number = 100) {
    const polarData: number[][] = [];

    input.forEach((e, i, a) => {
      e += radius;
      const angle = (i * (Math.PI * 2)) / a.length;
      const x = e * Math.cos(angle);
      const y = e * Math.sin(angle);
      polarData.push([x + this.canvas.width / 2, y + this.canvas.height / 2]);
    });

    return polarData;
  }

  // Drawing tools
  particles(
    data: number[][],
    velocity: number[] = [1, 1],
    gravity: number = 1,
    lifespan: number = Infinity,
    birthrate: number = 1,
    samples: number = 100
  ) {
    const frame = this.frame;
    class particle {
      canvasSize: number[];
      position: number[];
      velocity: number[];
      gravity: number;
      live: boolean = true;
      born: number = frame;

      constructor(position: number[], velocity: number[], gravity: number) {
        this.canvasSize = [500, 500];
        this.position = position;
        this.velocity = [
          (Math.random() - 0.5) * velocity[0],
          (Math.random() - 0.5) * velocity[1],
        ];
        this.gravity = gravity;
      }

      // Particle update method
      update(): void {
        // Update velocity
        this.velocity = [this.velocity[0], this.velocity[1] + this.gravity];

        // Update position
        const x = this.position[0] + this.velocity[0];
        const y = this.position[1] + this.velocity[1];
        this.position = [x, y];

        // Check if particle in canvas and kill if not
        if (
          this.position[0] < 0 ||
          this.position[0] > this.canvasSize[0] ||
          this.position[1] < 0 ||
          this.position[1] > this.canvasSize[1]
        ) {
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
        this.particleSystem.push(new particle(data[i], velocity, gravity));
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
        } else if (e.live === false || this.frame - e.born > 1) {
          this.particleSystem.splice(i, 1);
        }

        // Draw Particle
        this.ctx.roundRect(e.position[0], e.position[1], 1, 1, 1000);
      });
    }
  }

  dots(data: number[][], samples: number = 100) {
    // Define number of dots
    const sampling = Math.ceil(data.length / samples);

    // Draw dots
    for (let i = 0; i < data.length; i += sampling) {
      this.ctx.roundRect(data[i][0], data[i][1], 1, 1, 1000);
    }
  }

  line(data: number[][], samples: number = 1024) {
    // Define sampling rate for line
    const sampling = Math.ceil(data.length / samples);

    // Draw line
    this.ctx.beginPath();

    for (let i = 0; i < data.length; i += sampling) {
      if (i === 0) {
        this.ctx.moveTo(data[i][0], data[i][1]);
      } else {
        this.ctx.lineTo(data[i][0], data[i][1]);
      }
    }
  }

  bars(data: number[][], numBars: number = 10) {
    const sampling = Math.round(data.length / numBars);
    const offset = this.canvas.width / numBars / 2;

    this.ctx.beginPath();

    for (let i = 0; i < data.length; i += sampling) {
      const e = data[i];

      this.ctx.moveTo(e[0] + offset, this.canvas.height);
      this.ctx.lineTo(e[0] + offset, e[1]);
    }
  }

  // TODO polarBars still needs work
  polarBars(data, radius = 100, numBars = 50) {
    const innerCircle = [];
    data.forEach((e, i, a) => {
      const angle = (i * (Math.PI * 2)) / a.length;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      innerCircle.push([x + this.canvas.width / 2, y + this.canvas.height / 2]);
    });

    const sampling = Math.ceil(data.length / numBars);

    this.ctx.beginPath();
    for (let i = 0; i < data.length; i += sampling) {
      const e = innerCircle[i];
      this.ctx.moveTo(...e);
      const f = data[i];
      this.ctx.lineTo(...f);
    }
  }

  // Color tools
  randomColor() {
    const r: number = Math.random() * 255;
    const g: number = Math.random() * 255;
    const b: number = Math.random() * 255;

    return `rgb(${r},${g},${b})`;
  }

  randomPalette(
    colorArray: string[] = ['#57BBDE', '#9DDE57', '#CC57DE', '#DE9C57']
  ) {
    return colorArray[Math.round(Math.random() * colorArray.length)];
  }

  linearGradient(
    color1: string = '#E34AB0',
    color2: string = '#5BC4F9',
    flip: string = ''
  ) {
    let gradient: CanvasGradient;

    // Define direction of gradient
    if (flip === 'flip') {
      gradient = this.ctx.createLinearGradient(
        this.canvas.width / 2,
        0,
        this.canvas.width / 2,
        this.canvas.height
      );
    } else {
      gradient = this.ctx.createLinearGradient(
        0,
        this.canvas.height / 2,
        this.canvas.width,
        this.canvas.height / 2
      );
    }

    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    return gradient;
  }

  radialGradient(
    color1: string = '#E34AB0',
    color2: string = '#5BC4F9',
    innerRadius: number = 0,
    outerRadius: number = 250
  ) {
    const gradient: CanvasGradient = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      innerRadius,
      this.canvas.width / 2,
      this.canvas.height / 2,
      outerRadius
    );

    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    return gradient;
  }

  // Style Tools
  style(lineWidth: number = 2, fill: string = '', color: string = '#E34AB0') {
    this.ctx.lineWidth = lineWidth;

    // Fill Rect
    if (fill === 'fillRect') {
      this.ctx.lineTo(this.canvas.width, this.canvas.height);
      this.ctx.lineTo(0, this.canvas.height);
      if (typeof color === 'string') {
        this.ctx.fillStyle = color;
      }
      if (Array.isArray(color)) {
        this.ctx.fillStyle = this.ctx.strokeStyle = this.linearGradient(
          color[0],
          color[1]
        );
      }
      this.ctx.fill();
    }

    // Fill Polar
    if (fill === 'fillPolar') {
      if (typeof color === 'string') {
        this.ctx.fillStyle = color;
      }
      if (Array.isArray(color)) {
        this.ctx.fillStyle = this.ctx.strokeStyle = this.radialGradient(
          color[0],
          color[1]
        );
      }
      this.ctx.fill();
    }

    // Fill Dashes
    if (fill === 'dashes') {
      if (typeof color === 'string') {
        this.ctx.fillStyle = color;
      }
      if (Array.isArray(color)) {
        this.ctx.fillStyle = this.ctx.strokeStyle = this.linearGradient(
          color[0],
          color[1],
          'flip'
        );
      }
      this.ctx.fill();
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
  layer(options: IOptions) {
    // New Path
    this.ctx.beginPath();

    // Data
    let inputData;
    let data;

    // Domain switch
    switch (options.domain[0]) {
      case 'freq':
        inputData = this.dataPreProcessor(
          'freq',
          options.domain[1],
          options.domain[2]
        );
        break;
      case 'time':
        inputData = this.dataPreProcessor(
          'time',
          options.domain[1],
          options.domain[2]
        );
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
        data = this.dataToPolar(inputData, options.coord[1]);
        break;
      default:
        data = this.dataToRect(inputData);
        break;
    }

    // Vizualizer switch //TODO Check Polar Bars
    switch (options.viz[0]) {
      case 'line':
        this.line(data, options.viz[1]);
        break;
      case 'bars':
        this.bars(data, options.viz[1]);
        break;
      case 'polarBars':
        this.polarBars(data);
        break;
      case 'dots':
        this.dots(data, options.viz[1]);
        break;
      case 'particles':
        this.particles(
          data,
          options.viz[1],
          options.viz[2],
          options.viz[3],
          options.viz[4],
          options.viz[5]
        );
        break;
      default:
        this.line(data);
        break;
    }

    // Color switch //TODO Random per item instead of per frame
    switch (options.color[0]) {
      case 'linearGradient':
        this.ctx.strokeStyle = this.linearGradient(
          options.color[1],
          options.color[2],
          options.color[3]
        );
        break;
      case 'radialGradient':
        this.ctx.strokeStyle = this.radialGradient(
          options.color[1],
          options.color[2]
        );
        break;
      case 'randomColor':
        this.ctx.strokeStyle = this.randomColor();
        break;
      case 'randomPalette':
        this.ctx.strokeStyle = this.randomPalette(options.color[1]);
        break;
      default:
        this.ctx.strokeStyle = options.color;
        break;
    }

    // Style
    this.style(...options.style);

    // Transforms
    // TODO WIP
    // this.mirror();

    // Draw Path
    this.ctx.stroke();
  }

  //! RENDER

  render(options: IOptions | IOptions[]) {
    // Clear Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Default options
    const defaults: IOptions = {
      domain: ['time'],
      coord: ['rect'],
      viz: ['line'],
      color: ['#E34AB0'],
      style: [2],
    };

    // Draw
    if (!options) {
      this.layer(defaults);
    } else if (Array.isArray(options)) {
      options.forEach((e) => {
        this.layer(Object.assign(defaults, e));
      });
    } else {
      this.layer(Object.assign(defaults, options));
    }

    // Increment frame counter
    this.frame++;

    // Start Animation Loop
    this.renderLoop = requestAnimationFrame(this.render.bind(this, options));
  }

  stop() {
    cancelAnimationFrame(this.renderLoop);
  }

  // Conveniency Methods
  simpleLine(options = '#E34AB0') {
    this.render({ color: [options] });
  }

  simpleBars(options = '#E34AB0') {
    this.render({
      domain: ['time', 300],
      viz: ['bars'],
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

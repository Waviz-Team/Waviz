import AudioAnalyzer from '../analysers/analyzer';
import { IVisualizer } from '../types/types';
import { mapArray } from '../utils/mathUtils';

class Visualizer implements IVisualizer {
  canvas;
  ctx;
  data;
  rectData;
  renderLoop;
  frame = 0;
  particleSystem;

  constructor(canvas, data) {
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
    this.renderLoop;
  }

  // Data tools
  dataPreProcessor(dataType: string = 'time', range: number = 100) {
    let data = [];

    // Select data type - 'freq' or 'time'
    switch (dataType) {
      case 'fft':
        data = this.data.freqData;
        break;
      case 'time':
        data = this.data.timeData;
        break;
    }
    // Normalize data
    const normalized = Array.from(data).map((e) => e / 255);

    // Range Map
    const processedData = mapArray(normalized, 0, 1, range, -range);

    return processedData;
  }

  // Data Transforms
  dataToRect(input) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const data = input;
    const rectData = [];

    data.forEach((e, i) => {
      const x = (i / data.length) * width;
      const y = height / 2 + e;
      rectData.push([x, y]);
    });
    return rectData;
  }

  dataToPolar(input, radius: number = 100) {
    const data = input;
    const polarData = [];

    data.forEach((e, i, a) => {
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
    data,
    velocity: number[] = [1, 1],
    gravity: number = 1,
    beatSync: boolean = false
  ) {
    const frame = this.frame;
    class particle {
      canvasSize;
      position;
      velocity;
      gravity;
      live = true;
      born = frame;

      constructor(position, velocity, gravity) {
        this.canvasSize = [500, 500];
        this.position = position;
        this.velocity = [
          (Math.random() - 0.5) * velocity[0],
          (Math.random() - 0.5) * velocity[1],
        ];
        this.gravity = gravity;
      }

      update() {
        if (
          this.position[0] >= 0 &&
          this.position[0] <= this.canvasSize[0] &&
          this.position[1] >= 0 &&
          this.position[0] <= this.canvasSize[1]
        ) {
          this.velocity = [this.velocity[0], this.velocity[1] + this.gravity];

          const x = this.position[0] + this.velocity[0];
          const y = this.position[1] + this.velocity[1];
          this.position = [x, y];
        }

        if (
          this.position[0] < 0 ||
          this.position[0] > this.canvasSize[0] ||
          this.position[1] < 0 ||
          this.position[1] > this.canvasSize[1]
        ) {
          this.live = false;
        }

        if (frame - this.born > 100) {
          this.live = false;
        }
      }
    }

    if (!this.particleSystem) {
      this.particleSystem = [];
    }

    for (let i = 0; i < data.length; i += 100) {
      this.particleSystem.push(new particle(data[i], velocity, gravity));
    }

    if (this.particleSystem) {
      this.particleSystem.forEach((e, i) => {
        if (e.live === true) {
          e.update();
          console.log(this.particleSystem.length);
        } else if (e.live === false) {
          this.particleSystem.splice(i, 1);
        }
        this.ctx.rect(...e.position, 1, 1);
      });
    }
  }

  dots(data, samples = 100) {
    const sampling = Math.ceil(data.length / samples);
    for (let i = 0; i < data.length; i += sampling) {
      this.ctx.rect(...data[i], 1, 1);
    }
  }

  line(data, samples = 1024) {
    const sampling = Math.ceil(data.length / samples);
    this.ctx.beginPath();
    for (let i = 0; i < data.length; i += sampling) {
      if (i === 0) {
        this.ctx.moveTo(...data[i]);
      } else {
        this.ctx.lineTo(...data[i]);
      }
    }
  }

  bars(data, numBars = 10) {
    const sampling = Math.ceil(data.length / numBars);
    this.ctx.beginPath();

    for (let i = 0; i < data.length; i += sampling) {
      const e = data[i];

      this.ctx.moveTo(e[0], this.canvas.height);
      this.ctx.lineTo(...e);
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
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;

    return `rgb(${r},${g},${b})`;
  }

  randomPalette(colorArray = ['#57BBDE', '#9DDE57', '#CC57DE', '#DE9C57']) {
    return colorArray[Math.round(Math.random() * colorArray.length)];
  }

  linearGradient(color1 = '#E34AB0', color2 = '#5BC4F9') {
    const gradient = this.ctx.createLinearGradient(
      0,
      this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height / 2
    );

    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    return gradient;
  }

  radialGradient(
    color1 = '#E34AB0',
    color2 = '#5BC4F9',
    innerRadius = 0,
    outerRadius = 250
  ) {
    const gradient = this.ctx.createRadialGradient(
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

  // Line Tools
  // TODO Style is still WIP
  style(lineWidth: number = 2, fill: string = '', color = '#E34AB0') {
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
    if (fill === 'dashes'){
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
      this.ctx.setLineDash([10, 10]);
    }
    

  }

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

    // Frequency switch
    switch (options.freq[0]) {
      case 'fft':
        inputData = this.dataPreProcessor('fft', options.freq[1]);
        break;
      case 'time':
        inputData = this.dataPreProcessor('time', options.freq[1]);
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
        this.particles(data, options.viz[1], options.viz[2]);
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
          options.color[2]
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
        this.ctx.strokeStyle = '#E34AB0';
        break;
    }

    // Style
    this.style(...options.style);

    // Transforms
    // TODO WIP
    // this.mirror();

    // Draw Path
    // this.ctx.lineWidth = 5;
    // this.ctx.closePath()
    this.ctx.stroke();
  }

  //! RENDER

  render(options) {
    // Clear Canvas
    this.ctx.reset();

    // Draw
    if (Array.isArray(options)) {
      options.forEach((e) => {
        this.layer(e);
      });
    } else {
      this.layer(options);
    }

    // Increment frame counter
    this.frame++;

    // Start Animation Loop
    this.renderLoop = requestAnimationFrame(this.render.bind(this, options));
  }

  stop() {
    cancelAnimationFrame(this.renderLoop);
  }
}

export default Visualizer;

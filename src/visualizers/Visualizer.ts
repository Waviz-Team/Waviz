import AudioAnalyzer from '../analysers/analyzer';
import { IVisualizer } from '../types/types';
import { mapArray } from '../utils/mathUtils';

class Visualizer implements IVisualizer {
  canvas;
  ctx;
  data;
  rectData;
  renderLoop;

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
  dataPreProcessor(dataType: string) {
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
    const processedData = mapArray(normalized, 0, 1, 0, 255);

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

  dataToPolar(input) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const data = input;
    const polarData = [];

    data.forEach((e, i, a) => {
      const angle = (i * (Math.PI * 2)) / a.length;
      const x = e * Math.cos(angle);
      const y = e * Math.sin(angle);
      polarData.push([x + width / 2, y + height / 2]);
    });

    return polarData;
  }

  // Drawing tools
  particles(data, position, velocity, gravity) {
    class particle {
      canvasSize;
      position;
      velocity;
      gravity;
      live = true;

      constructor(position, velocity, gravity) {
        this.canvasSize = [500, 500];
        this.position = position;
        this.velocity = velocity;
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
      }
    }

    if (!this.particleSystem) {
      this.particleSystem = [];
    }

    for (let i = 0; i < data.length; i += 100) {
      this.particleSystem.push(
        new particle(
          data[i],
          [(Math.random() - 0.5) * 10, -Math.random() * 10],
          1
        )
      );
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

  dots(data) {
    data.forEach((e) => {
      this.ctx.rect(...e, 1, 1);
    });
  }

  line(data) {
    this.ctx.beginPath();
    data.forEach((e, i) => {
      if (i === 0) {
        this.ctx.moveTo(...e);
      } else {
        this.ctx.lineTo(...e);
      }
    });
    // this.ctx.closePath()
    // this.ctx.stroke()
  }

  bars(data, numBars = 10) {
    const sampling = Math.round(data.length / numBars);
    this.ctx.beginPath();

    for (let i = 0; i < data.length; i += sampling) {
      const e = data[i];

      this.ctx.moveTo(e[0], this.canvas.height);
      this.ctx.lineTo(...e);
      this.ctx.lineWidth=25
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
    innerRadius = 100,
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

  // Render methods

  layer(options) {
    // Draw
    this.ctx.beginPath();
    // Data
    const inputData = this.dataPreProcessor(options.freq);
    let data;

    switch (options.coord) {
      case 'rect':
        data = this.dataToRect(inputData);
        break;
      case 'polar':
        data = this.dataToPolar(inputData);
        break;

      default:
        break;
    }

    // Vizualizer
    switch (options.viz) {
      case 'line':
        this.line(data);
        break;
      case 'bars':
        this.bars(data);
        break;
      case 'dots':
        this.dots(data);
        break;
      case 'particles':
        this.particles(data);
        break;
    }

    // Style
    switch (options.color) {
      case 'linearGradient':
        this.ctx.strokeStyle = this.linearGradient();
        break;
      case 'radialGradient':
        this.ctx.strokeStyle = this.radialGradient();
        break;
      case 'randomColor':
        this.ctx.strokeStyle = this.randomColor();
        break;
      case 'randomPalette':
        this.ctx.strokeStyle = this.randomPalette();
        break;
      default:
        this.ctx.strokeStyle = options.color;
        break;
    }

    // Render
    this.ctx.stroke();
  }

  //! RENDER
  render() {
    // Clear Canvas
    this.ctx.reset();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw
    this.layer({
      freq: 'time',
      coord: 'rect',
      viz: 'bars',
      color:'linearGradient'
    });

    // Start Animation Loop
    this.renderLoop = requestAnimationFrame(this.render.bind(this));
  }

  stop() {
    cancelAnimationFrame(this.renderLoop);
  }
}

export default Visualizer;

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
      case 'freq':
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
      const y = height / 2 + (e / 255 - 0.5) * 255;
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
          this.position[0] > 0 &&
          this.position[0] < this.canvasSize[0] &&
          this.position[1] > 0 &&
          this.position[0] < this.canvasSize[1]
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
        this.ctx.rect(...e.position, 3, 3);
      });
    }
  }

  dots(data) {
    this.processedData.forEach((e) => {
      // this.ctx.fillStyle = this.randomColor();
      this.ctx.fillRect(...e, 5, 5);
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

  bars(numBars = 10) {
    const data = this.processedData;
    const sampling = Math.round(data.length / numBars);
    this.ctx.beginPath();

    for (let i = 0; i < data.length; i += sampling) {
      const e = data[i];

      this.ctx.moveTo(e[0], this.canvas.height);
      this.ctx.lineTo(...e);
    }
  }

  // Color tools
  randomColor() {
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;

    return `rgb(${r},${g},${b})`;
  }

  linearGradient() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const gradient = this.ctx.createLinearGradient(
      0,
      height / 2,
      width,
      height / 2
    );

    gradient.addColorStop(0, '#E34AB0');
    gradient.addColorStop(1, '#5BC4F9');

    return gradient;
  }

  radialGradient() {
    const halfWidth = this.canvas.width / 2;
    const halfHeight = this.canvas.height / 2;
    const gradient = this.ctx.createRadialGradient(
      halfWidth,
      halfHeight,
      100,
      halfWidth,
      halfHeight,
      150
    );

    gradient.addColorStop(0, '#E34AB0');
    gradient.addColorStop(1, '#5BC4F9');

    return gradient;
  }

  setup(type, coord, vizType) {
    this.ctx.beginPath();
    const processedData = this.dataPreProcessor(type);
    let data = [];

    switch (coord) {
      case 'rect':
        data = this.dataToRect(processedData);
        break;
      case 'polar':
        data = this.dataToPolar(processedData);
    }

    switch (vizType) {
      case 'line':
        this.line(data);
        break;
    }

    return data;
  }

  stroke() {
    this.ctx.stroke();
  }

  color(color) {
    this.ctx.strokeStyle = color;
  }
  // Render methods
  
  layer(){
        // Draw
    this.ctx.beginPath()
      // Data
      const data = this.dataToPolar(this.dataPreProcessor('time'))

      // Style 
      this.ctx.strokeStyle = 'white'

      // Vizualizer
      this.line(data)

      // Render
      this.ctx.stroke()
  }

  //! RENDER
  render() {
    // Clear Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw
    this.ctx.beginPath()
      // Data
      const data = this.dataToRect(this.dataPreProcessor('time'))

      // Style 
      this.ctx.strokeStyle = 'red'

      // Vizualizer
      this.line(data)

      // Render
      this.ctx.stroke()

    this.layer()






    // Start Animation Loop
    this.renderLoop = requestAnimationFrame(this.render.bind(this));
  }
  
  
  // contextManager() {


    // const processedData = this.dataPreProcessor('time');
    // const data = this.dataToRect(processedData);

    // this.ctx.beginPath();
    // const color = this.linearGradient();
    // this.ctx.lineWidth = 40;
    // this.ctx.strokeStyle = color;
    // this.ctx.setLineDash([10, 10]);
    // this.bars(data);
    // this.ctx.stroke();

    // const data2 = this.dataToRect(processedData);
    // const color2 = this.linearGradient();
    // this.ctx.strokeStyle = color2;
    // this.ctx.lineWidth = 10;
    // this.line(data2);
    // this.ctx.stroke();

    // this.ctx.beginPath();
    // const color2 = this.radialGradient();
    // this.ctx.fillStyle = color2;
    // this.particles(data);
    // this.ctx.fill();
  // }

  

  stop() {
    cancelAnimationFrame(this.renderLoop);
  }
}

export default Visualizer;

//* OLD Methods

// wave(options?) {
//   // User Style options
//   const {
//     lineWidth = 2,
//     lineColor = '#E34AB0',
//     multiplier = 1,
//   } = options || {};

//   // Get live data
//   const dataArray = this.analyser.timeData;
//   const bufferLength = this.analyser.bufferLength;
//   // console.log(dataArray)
//   // Setup canvas
//   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//   this.ctx.lineWidth = lineWidth;
//   this.ctx.strokeStyle = lineColor;

//   // Draw waveform
//   this.ctx.beginPath();
//   const points = this.canvas.width / bufferLength;
//   let x = 0;

//   for (let i = 0; i < bufferLength; i++) {
//     // Normalize values
//     const v = dataArray[i] / 256;
//     const y =
//       this.canvas.height / 2 + (v - 0.5) * this.canvas.height * multiplier;

//     if (i === 0) {
//       this.ctx.moveTo(x, y);
//     } else {
//       this.ctx.lineTo(x, y);
//     }
//     x += points;
//   }

//   this.ctx.stroke();

//   // Re-run draw cycle on next anumation frame
//   this.renderLoop = requestAnimationFrame(this.wave.bind(this, options));
// }

// bars(options?) {
//   // User Style options
//   const {
//     barWidth = 20,
//     fillStyle = '#E34AB0',
//     numBars = 10,
//   } = options || {};

//   // Get live data
//   const dataArray = this.analyser.freqData;
//   const bufferLength = this.analyser.bufferLength;

//   // Setup canvas
//   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//   this.ctx.fillStyle = fillStyle;

//   // Draw bars
//   const bars = this.canvas.width / numBars;
//   let x = 0;

//   for (let i = 0; i < bufferLength; i += Math.floor(bufferLength / numBars)) {
//     // Normalize values
//     const v = dataArray[i] / 256;
//     const y = v * this.canvas.height;
//     this.ctx.fillRect(x, this.canvas.height, barWidth, -y);

//     x += bars;
//   }
//   // Re-run draw cycle on next anumation frame
//   this.renderLoop = requestAnimationFrame(this.bars.bind(this, options));
// }
//

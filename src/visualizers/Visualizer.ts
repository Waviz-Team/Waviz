import { IVisualizer } from '../types/types';

class Visualizer implements IVisualizer {
  canvas;
  ctx;
  data;
  rectData;
  renderLoop;

  constructor(canvas, data) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = data;
    this.renderLoop;
  }

  dataProcessor(dataType: string) {
    let processedData = [];

    switch (dataType) {
      case 'freq':
        processedData = this.data.freqData;
        break;
      case 'time':
        processedData = this.data.timeData;
        break;
    }

    return processedData;
  }

  dataToRect() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const data = this.data.timeData;
    const rectData = [];

    data.forEach((e, i) => {
      const x = (i / data.length) * width;
      const y = e;
      rectData.push([x, y]);
    });

    return rectData;
  }

  dataToPolar() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const data = this.data.timeData;
    const polarData = [];

    data.forEach((e, i, a) => {
      const x = e * Math.cos(i);
      const y = e * Math.sin(i);
      polarData.push([x + width / 2, y + height / 2]);
    });

    return polarData;
  }

  contextManager(){
    
  }

  render() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.clearRect(0, 0, width, height);

    // Test dots
    const data = this.dataToPolar();
    console.log('Time data is : ', data);
    data.forEach((e) => {
      this.ctx.fillStyle = 'darkRed';
      this.ctx.fillRect(...e, 5, 5);
    });

    this.renderLoop = requestAnimationFrame(this.render.bind(this));
  }

  wave(options?) {
    // User Style options
    const {
      lineWidth = 2,
      lineColor = '#E34AB0',
      multiplier = 1,
    } = options || {};

    // Get live data
    const dataArray = this.analyser.timeData;
    const bufferLength = this.analyser.bufferLength;
    // console.log(dataArray)
    // Setup canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = lineColor;

    // Draw waveform
    this.ctx.beginPath();
    const points = this.canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      // Normalize values
      const v = dataArray[i] / 256;
      const y =
        this.canvas.height / 2 + (v - 0.5) * this.canvas.height * multiplier;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      x += points;
    }

    this.ctx.stroke();

    // Re-run draw cycle on next anumation frame
    this.renderLoop = requestAnimationFrame(this.wave.bind(this, options));
  }

  bars(options?) {
    // User Style options
    const {
      barWidth = 20,
      fillStyle = '#E34AB0',
      numBars = 10,
    } = options || {};

    // Get live data
    const dataArray = this.analyser.freqData;
    const bufferLength = this.analyser.bufferLength;

    // Setup canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = fillStyle;

    // Draw bars
    const bars = this.canvas.width / numBars;
    let x = 0;

    for (let i = 0; i < bufferLength; i += Math.floor(bufferLength / numBars)) {
      // Normalize values
      const v = dataArray[i] / 256;
      const y = v * this.canvas.height;
      this.ctx.fillRect(x, this.canvas.height, barWidth, -y);

      x += bars;
    }
    // Re-run draw cycle on next anumation frame
    this.renderLoop = requestAnimationFrame(this.bars.bind(this, options));
  }

  stop() {
    cancelAnimationFrame(this.renderLoop);
  }
}

export default Visualizer;

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

  // Data tools
  dataPreProcessor(dataType: string) {
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
  particles(data, position, velocity, gravity){

    class particle{
      canvasSize;
      position;
      velocity
      gravity
      live=true

      constructor(position, velocity, gravity){
        this.canvasSize = [500,500]
        this.position = position
        this.velocity = velocity
        this.gravity = gravity
      }

      update(){
        if (this.position[0]>0 && this.position[0]<this.canvasSize[0] && this.position[1]>0 && this.position[0]<this.canvasSize[1]){
          this.velocity = [this.velocity[0], this.velocity[1]+this.gravity]
          
          const x = this.position[0]+this.velocity[0];
          const y = this.position[1]+this.velocity[1];
          this.position = [x,y]
        }
        // if(this.position[0]<0 || this.position[0]>this.canvasSize[0] || this.position[1]<0 || this.position[0]>this.canvasSize[1]){
        //   this.live=false
        // }
      }
    }

    if (!this.particleSystem){
      this.particleSystem = []
      data.forEach((e)=>{
        this.particleSystem.push(new particle(e, [(Math.random()-0.5)*10,-Math.random()*10], 1))
        // console.log(this.particleSystem)
      })
    }

    if(this.particleSystem){
      this.particleSystem.forEach((e)=>{
        if (e.live===true){
          e.update()
          console.log(e.live)
        }
        if(e.live===false){
          e = new particle(e, [(Math.random()-0.5)*10,-Math.random()*10], 1)
          e.update()
        }
        this.ctx.fillRect(...e.position, 5, 5)
      })
    }
  }

  dots(data) {
    data.forEach((e) => {
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


  //! Still not working correctly
  bars(data) {
    this.ctx.beginPath();
    data.forEach((e, i) => {
      this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.lineTo(...e);
    });
  }


  //Color tools
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

  radialGradient(){
    const halfWidth = this.canvas.width/2;
    const halfHeight = this.canvas.height/2;
    const gradient = this.ctx.createRadialGradient(halfWidth, halfHeight, 100, halfWidth, halfHeight, 150);

    gradient.addColorStop(0, '#E34AB0');
    gradient.addColorStop(1, '#5BC4F9');

    return gradient
  }

  contextManager() {
    const processedData = this.dataPreProcessor('time');
    const data = this.dataToPolar(processedData);

    const color = this.radialGradient();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = color;
    this.line(data);
    this.ctx.stroke();

    // const data2 = this.dataToRect(processedData);
    // const color2 = this.linearGradient();
    // this.ctx.strokeStyle = color2;
    // this.ctx.lineWidth = 10;
    // this.line(data2);
    // this.ctx.stroke();


  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.contextManager();
    this.renderLoop = requestAnimationFrame(this.render.bind(this));
  }

  stop() {
    cancelAnimationFrame(this.renderLoop);
  }
}

export default Visualizer;

// ---

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

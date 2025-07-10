import Waviz from "../primary/waviz";

interface Visualizer {
  canvas: HTMLElement;
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  bufferLength: number;
  analyser: any;
}

class Visualizer {
  constructor(canvas, analyser) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dataArray = analyser.dataArray;
    this.bufferLength = analyser.bufferLength;
    this.analyser = analyser;
  }

  
  wave() {
    const dataArray = this.analyser.dataArray;
    const bufferLength = this.analyser.bufferLength;

    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'red';
    this.ctx.beginPath();
    // const points = this.canvas.width / this.bufferLength;
    const points = this.canvas.width / this.bufferLength;
    let x = 0;
    for (let i = 0; i < this.bufferLength; i++) {
      const v = this.dataArray[i] / 256.0; // Normalize
      const y = (v * this.canvas.height);
        // const y = this.dataArray[i];
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      x += points;
    }
    
    this.ctx.stroke();
    requestAnimationFrame(this.wave.bind(this));
  }
}

// Testing path

const canvas = document.getElementById('canvas');
const audio = document.getElementById('audio');
const wavizTest = new Waviz();

canvas.width = 800;
canvas.height = 200;

wavizTest.connectToHTMLElement(audio);

const liveData = {
  get dataArray() { //? Get is interesting...
    const buffer = wavizTest.getFreqBuffer();
    return buffer ? buffer.dataArray : new Uint8Array(0);
  },
  get bufferLength() {
    const buffer = wavizTest.getFreqBuffer();
    return buffer ? buffer.bufferLength : 0
  }
}

const waveVis = new Visualizer(canvas, liveData);

audio.addEventListener('play', () => {
  console.log('Buffer length:', liveData.bufferLength);
  console.log('Data array length:', liveData.dataArray.length);
  console.log('Audio context state:', wavizTest.input.audioContext?.state);
  console.log('Data array sample:', liveData.dataArray.slice(0, 10));
  waveVis.wave();
})
;
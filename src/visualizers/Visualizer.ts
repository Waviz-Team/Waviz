
interface Visualizer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  bufferLength: number;
  analyser: any;
}

class Visualizer {
  constructor(canvas, analyser) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.analyser = analyser;
  }

  wave() {
    // Get live data
    const dataArray = this.analyser.dataArray;
    const bufferLength = this.analyser.bufferLength;

    // Setup canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'red';

    // Draw waveform
    this.ctx.beginPath();
    const points = this.canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      // Normalize values
      const v = dataArray[i] / 256;
      const y = v * this.canvas.height;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      x += points;
    }

    this.ctx.stroke();

    // Re-run draw cycle on next anumation frame
    requestAnimationFrame(this.wave.bind(this));
  }
}

export default Visualizer;

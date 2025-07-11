export class visualizer {
  canvas;
  ctx;
  analyser;

  constructor(analyser, canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.analyser = analyser;
  }

  wave() {
    // Get live data
    const dataArray = this.analyser.getTime();
    const bufferLength = dataArray.length / 2;

    // Setup canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#E34AB0';

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

  bars() {
    // Get live data
    const dataArray = this.analyser.getFrequency();
    const bufferLength = dataArray.length / 2;

    // Setup canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#E34AB0';
    let barWidth = 5;

    // Draw bars
    const bars = this.canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      // Normalize values
      const v = dataArray[i] / 256;
      const y = v * this.canvas.height;
      this.ctx.fillRect(x, this.canvas.height, barWidth, -y);

      x += bars;
    }
    // Re-run draw cycle on next anumation frame
    requestAnimationFrame(this.bars.bind(this));
  }
}

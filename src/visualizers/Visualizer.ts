type VisualizationType = 'wave' | 'bars' | 'dots' | 'spectrum';

class Visualizer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  analyser: any;
  currentType: VisualizationType = 'wave';
  animationId: number | null = null; // Kill switch for animation loop. Without this, we lose ref and animation runs forever
  isRunning: boolean = false;

  constructor(canvas, analyser) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.analyser = analyser;
  }

  //* API for starting/stopping
  start(type: VisualizationType = 'wave') {
    this.currentType = type;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  switchTo(type: VisualizationType) {
    this.currentType = type;
  }

  animate() {
    if (!this.isRunning) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.currentType) { // Switched from if statements to switch because it's apparantly faster once we have more than 5 items than if/else
      case 'wave':
        this.wave();
        break;
      case 'bars':
        this.bars();
    }

    this.animationId = requestAnimationFrame(() => this.animate()); // Animation frame request moved here for more control/modularity. Needed like this so that I can grab the number for cancellation without running animationframe again. 
  }

  //* Visualizers
  wave() {
    // Get live data
    const dataArray = this.analyser.timeData;
    const bufferLength = this.analyser.bufferLength;

    if (!dataArray || bufferLength === 0) return; // Sanitation check

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
  }

  bars() {}

  //* Methods to start visualizations
  startWave() {
    this.start('wave');
  }

  startBars() {
    this.start('bars');
  }
}

export default Visualizer;

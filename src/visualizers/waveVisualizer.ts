//
// {dataArray, bufferLength}
// dataArray is the arrays of values from the ftt
// bufferLength is the range of the values in the dataArray

// TEMP AUDIO INPUT FUNCTION
function analyser() {
  const audioElement = document.getElementById('audio');
  const audioContext = new window.AudioContext();
  const sourceNode = audioContext.createMediaElementSource(audioElement);
  const analyser = audioContext.createAnalyser();

  analyser.fftSize = 2048;
  const bufferLength = analyser.fftSize;
  const dataArray = new Uint8Array(bufferLength);

  sourceNode.connect(analyser);
  sourceNode.connect(audioContext.destination);
  analyser.getByteTimeDomainData(dataArray);

  return { dataArray, bufferLength };
}

interface Visualizer {
  canvas: HTMLElement;
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  bufferLength: number;
}

class Visualizer {
  constructor(canvas, analyser) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dataArray = analyser.dataArray;
    this.bufferLength = analyser.bufferLength;
  }

  wave() {
    requestAnimationFrame(this.wave);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = 'blue';
    this.ctx.beginPath();
    const points = canvas.width / this.bufferLength;
    let x = 0;
    for (let i = 0; i < this.bufferLength; i++) {
      const y = this.dataArray[i];
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      x += points;
    }

    this.ctx.stroke();
  }
}

const canvas = document.getElementById('canvas');
const data = analyser();
const viz = new Visualizer(canvas, data);
viz.wave();

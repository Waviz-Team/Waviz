import { mapArray } from '../utils/mathUtils';

// Mock Data
const data = {
  dataArray: [
    111, 165, 152, 43, 75, 46, 128, 130, 61, 55, 220, 193, 32, 253, 242, 167,
    173, 171, 17, 233, 250, 58, 34, 51, 20, 182, 180, 88, 211, 68, 52, 105, 149,
    39, 147, 158, 99, 30, 13, 214, 150, 241, 2, 97, 252, 87, 201, 112, 216, 197,
    92, 226, 155, 181, 69, 176, 11, 196, 209, 177, 154, 188, 8, 19, 53, 222,
    118, 186, 25, 70, 244, 123, 231, 27, 76, 4, 162, 236, 109, 139, 174, 115,
    199, 117, 254, 113, 33, 239, 64, 131, 78, 172, 9, 12, 208, 71, 120, 40, 246,
    251, 94, 1, 146, 212, 127, 184, 24, 91, 202, 198, 129, 228, 205, 153, 31,
    243, 65, 204, 227, 190, 41, 7, 137, 72, 247, 101, 73, 66, 124, 10, 145, 132,
    206, 183, 256, 57, 232, 142, 255, 223, 48, 187, 14, 60, 89, 119, 16, 215, 0,
    178, 47, 136, 18, 219, 141, 126, 156, 185, 189, 210, 169, 217, 237, 249,
    235, 175, 134, 38, 45, 159, 135, 62, 79, 95, 96, 133, 50, 168, 28, 21, 161,
    140, 213, 82, 218, 114, 6, 192, 151, 108, 84, 225, 35, 85, 15, 54, 100, 160,
    106, 81, 98, 77, 234, 121, 207, 29, 67, 203, 238, 49, 144, 74, 143, 90, 93,
    170, 116, 3, 37, 56, 195, 138, 230, 163, 125, 164, 194, 107, 224, 104, 179,
    102, 245, 26, 110, 5, 44, 83, 229, 80, 191, 59, 42, 157, 63, 122, 248, 103,
    166, 200, 86, 148, 221, 36, 202, 23,
  ],
  bufferLength: 256,
};

function rotate(arr) {
  arr.unshift(arr.pop());
  return arr;
}

// Typescritp types
interface Visualizer {
  canvas: HTMLElement;
  ctx: CanvasRenderingContext2D;
  dataArray: Uint8Array;
  bufferLength: number;
}

// Visualizer class
class Visualizer {
  constructor(canvas, analyser) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dataArray = analyser.dataArray;
    this.bufferLength = analyser.bufferLength;
  }

  wave = (lineWidth, lineColor, amp) => {
    requestAnimationFrame(this.wave.bind(this));

    // rotate(this.dataArray);

    const amplitude = mapArray(this.dataArray, 0, 255, -amp, amp);


    // this.ctx.clearRect(0,0,300,150)
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = lineColor;

    this.ctx.beginPath();
    const points = canvas.width / this.bufferLength;
    let x = 0;

    for (let i = 0; i < this.bufferLength; i++) {
      // Normalize
      const v = amplitude[i] / this.bufferLength;
      const y = canvas.height / 2 + amplitude[i];

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      x += points;
    }

    this.ctx.stroke();
    // setTimeout(this.wave.bind(this))
  };
}

// Test
const canvas = document.getElementById('canvas');
const viz = new Visualizer(canvas, data);
viz.wave(2, 'red', 10);

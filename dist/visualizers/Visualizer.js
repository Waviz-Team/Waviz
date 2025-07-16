"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Visualizer {
    constructor(canvas, analyser) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.analyser = analyser;
        this.animationLoop;
    }
    wave(options) {
        // User Style options
        const { lineWidth = 2, lineColor = "#E34AB0", multiplier = 1, } = options || {};
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
            const y = this.canvas.height / 2 + (v - 0.5) * this.canvas.height * multiplier;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            }
            else {
                this.ctx.lineTo(x, y);
            }
            x += points;
        }
        this.ctx.stroke();
        // Re-run draw cycle on next anumation frame
        this.animationLoop = requestAnimationFrame(this.wave.bind(this, options));
    }
    bars(options) {
        // User Style options
        const { barWidth = 20, fillStyle = "#E34AB0", numBars = 10, } = options || {};
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
        this.animationLoop = requestAnimationFrame(this.bars.bind(this, options));
    }
    stop() {
        cancelAnimationFrame(this.animationLoop);
    }
}
exports.default = Visualizer;
//# sourceMappingURL=Visualizer.js.map
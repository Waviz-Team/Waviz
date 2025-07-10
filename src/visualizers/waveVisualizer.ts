import Input from "../input/input";
import AudioAnalyzer from "../analysers/analyzer";
//
// {dataArray, bufferLength}
// dataArray is the arrays of values from the ftt
// bufferLength is the range of the values in the dataArray

// TEMP AUDIO INPUT FUNCTION
// function analyser() {
//   const audioElement = document.getElementById('audio');
//   const audioContext = new window.AudioContext();
//   const sourceNode = audioContext.createMediaElementSource(audioElement);
//   const analyser = audioContext.createAnalyser();

//   analyser.fftSize = 2048;
//   const bufferLength = analyser.fftSize;
//   const dataArray = new Uint8Array(bufferLength);

//   sourceNode.connect(analyser);
//   sourceNode.connect(audioContext.destination);
//   analyser.getByteTimeDomainData(dataArray);

//   return { dataArray, bufferLength };
// }







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
    // this.ctx.clearRect(0,0,300, 150)
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'red';
    this.ctx.beginPath();
    // const points = this.canvas.width / this.bufferLength;
    const points = this.canvas.width / this.bufferLength;
    let x = 0;
    for (let i = 0; i < this.bufferLength; i++) {
      const v = this.dataArray[i] // 256.0; // Normalize
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

// Patch to make audio work
const test = document.getElementById("audio")
test.addEventListener('play', function(){
  input.audioContext.resume().then(()=>{
    console.log('playback resumed')
  })
})


// const canvas = document.getElementById('canvas');
// const song =document.getElementById('audio');

// // const audioAnalyzer = new AudioAnalyzer()

// // const input = new Input((sourceNode)=>{
// //   const audioContext = input.getAudioContext();
// //   // console.log(input.audioContext);
// //   if(input.audioContext.state === "suspended"){
// //     input.audioContext.resume()
// //   }
  
// //   if (audioContext) {
// //     audioAnalyzer.startAnalysis(audioContext, sourceNode);
// //   }

// const data = analyser()

// const viz = new Visualizer(canvas, data); //data = {dataArray:[], bufferLength:number}
// viz.wave();
// })


// const input = new Input();
// const aVis = async (sourceNode) => {
//   const audioContext = input.getAudioContext();

//   if (audioContext.state === 'suspended') { //! Cannot being called. CORS Issue
//     await audioContext.resume()
//   }

//   audioAnalyzer.startAnalysis(audioContext, sourceNode);

//   const data = audioAnalyzer.getFreqBuffer();
//   const viz = new Visualizer(canvas, data);
//   viz.wave();
// }

// let audioCheck = false;

// input.onAudioReady = (sourceNode) => {
//   if (!audioCheck) {
//     aVis(sourceNode);
//     audioCheck = true;
//   }
// }


input.connectToHTMLElement(song)





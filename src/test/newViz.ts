import Waviz from '../core/waviz';

// Document Elements
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const audio = document.getElementById('audio') as HTMLAudioElement;

// Waviz Instance
const viz = new Waviz(canvas, audio);

//Test on play
audio.addEventListener('play', async () => {
  viz.render({
    domain: ['time',500,,'hamming'],
    coord: ['rect',,90,2],
    viz:['bars',8],
    color:['randomColor'],
    // fill: ['linearGradient', ['red', 'blue']],
    stroke: [30,],
  });
});

// Test on pause
audio.addEventListener('pause', () => {
  viz.stop();
});

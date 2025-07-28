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
    coord: ['polar',100,90,5],
    viz:['particles'],
    // color:['randomColor'],
    // fill: ['linearGradient', ['red', 'blue']],
    stroke: [25,],
  });
});

// Test on pause
audio.addEventListener('pause', () => {
  viz.stop();
});

import Waviz from '../core/waviz';

// Document Elements
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const audio = document.getElementById('audio') as HTMLAudioElement;

// Waviz Instance
const viz = new Waviz(canvas, audio);

//Test on play
audio.addEventListener('play', async () => {
  viz.render();
});

// Test on pause
audio.addEventListener('pause', () => {
  viz.stop();
});


// {
//     setup:['time', 'polar', 'line'],
//     color:['white'],
//     stroke:[]
//   }
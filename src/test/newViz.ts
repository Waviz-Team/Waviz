import Waviz from '../core/waviz';

// Document Elements
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const audio = document.getElementById('audio') as HTMLAudioElement;

// Waviz Instance
const viz = new Waviz(canvas, audio);

//Test on play
audio.addEventListener('play', async () => {
  viz.visualizer.render([
    {
      freq: ['time', 100],
      coord: 'rect',
      viz: ['particles', [4,4], 0],
      color: ['linearGradient'],
    },  
    //   {
    //   freq: 'time',
    //   coord: 'polar',
    //   viz: 'polarBars',
    //   color: 'randomColor',
    // },
    // {
    //   freq: 'time',
    //   coord: 'polar',
    //   viz: 'particles',
    //   color: 'orange',
    // }, 
  ]);
});

// Test on pause
audio.addEventListener('pause', () => {
  viz.stop();
});
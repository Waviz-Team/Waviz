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
      coord: ['rect', 100],
      viz: ['bars'],
      color: ['linearGradient'],
      style: [30],
    },
    // {
    //   freq: ['time', 100],
    //   coord: ['polar', 100],
    //   viz: ['particles', [1, 1], 0.3, 30, 10, 15],
    //   color: [],
    //   style: [20],
    // },
  ]);
});

// Test on pause
audio.addEventListener('pause', () => {
  viz.stop();
});

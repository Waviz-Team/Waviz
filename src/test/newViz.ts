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
      domain: ['time'],
      coord: ['polar'],
      viz: ['line'],
      color: ['linearGradient'],
      style: [],
      periodic: false,
      window: 'hanning'
    },
  ]);
});

// Test on pause
audio.addEventListener('pause', () => {
  viz.stop();
});

//    velocity: number[] = [1, 1],
// gravity: number = 1,
// lifespan: number = Infinity,
// birthrate: number = 1,
// samples: number = 100

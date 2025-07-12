import Waviz from '../primary/waviz';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const audio = document.getElementById('audio') as HTMLAudioElement;
const wavizTest = new Waviz(canvas, audio);
// const wavizTest = new Waviz(canvas, 'microphone');
// const wavizTest = new Waviz(canvas, 'screenAudio');

// Testing option objects
const optionsWave = { lineWidth: 3, lineColor: 'blue', multipliyer: 3 };
const optionsBars = { barWidth: 10, fillStyle: 'blue', numBars: 20 };

//Test on play
audio.addEventListener('play', async () => {
  await wavizTest.input.initializePending(); //TODO: Figure out how to make this done in the classes
  wavizTest.visualizer.wave();
});


// Test on pause
audio.addEventListener('pause', () => {
  wavizTest.visualizer.stop();
});

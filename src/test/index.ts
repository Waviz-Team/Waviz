import Waviz from '../primary/waviz';
import Visualizer from '../visualizers/Visualizer';

const canvas = document.getElementById('canvas');
const audio = document.getElementById('audio');
const wavizTest = new Waviz();

wavizTest.connectToHTMLElement(audio);

const liveData = {
  get dataArray() {
    //? Get is interesting...
    const buffer = wavizTest.getFreqBuffer();
    return buffer ? buffer.dataArray : new Uint8Array(0);
  },
  get bufferLength() {
    const buffer = wavizTest.getFreqBuffer();
    return buffer ? buffer.bufferLength : 0;
  },
};






const waveVis = new Visualizer(canvas, liveData);

audio.addEventListener('play', () => {
  const optionsWave = { lineWidth: 3, lineColor: 'blue', multipliyer: 3 };

  const optionsBars = { barWidth: 10, fillStyle: 'blue', numBars: 20 };

  waveVis.bars(optionsBars);
});

audio.addEventListener('pause', () => {
  waveVis.stop();
});
waveVis.stop();

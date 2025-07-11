import Waviz from '../primary/waviz';
import Visualizer from '../visualizers/Visualizer';

const canvas = document.getElementById('canvas');
const audio = document.getElementById('audio');
const wavizTest = new Waviz();

wavizTest.connectToHTMLElement(audio);

const liveData = {
  get dataArray() {
    //? Get is interesting...
    const buffer = wavizTest.getTimeBuffer();
    return buffer ? buffer.dataArray : new Uint8Array(0);
  },
  get bufferLength() {
    const buffer = wavizTest.getTimeBuffer();
    return buffer ? buffer.bufferLength : 0;
  },
};

const waveVis = new Visualizer(canvas, liveData);

audio.addEventListener('play', () => {
  // console.log('Buffer length:', liveData.bufferLength);
  // console.log('Data array length:', liveData.dataArray.length);
  // console.log('Audio context state:', wavizTest.input.audioContext?.state);
  // console.log('Data array sample:', liveData.dataArray.slice(0, 10));
  waveVis.wave();
});

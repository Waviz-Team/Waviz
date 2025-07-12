import Waviz from '../primary/waviz';

const canvas = document.getElementById('canvas');
const audio = document.getElementById('audio');
 const wavizTest = new Waviz(canvas, audio);
// const wavizTest = new Waviz(canvas, 'microphone');
// const wavizTest = new Waviz(canvas, 'screenAudio');

audio.addEventListener('play', async () => {
  // const debugInfo = wavizTest.debugInfo();
  // console.log('Debug: ', debugInfo);

  // const timeData = wavizTest.getTimeDomainData();
  // console.log('Time data sample:', timeData?.slice(0, 10));

  await wavizTest.wave();
});

audio.addEventListener('play', () => {
  const optionsWave = { lineWidth: 3, lineColor: 'blue', multipliyer: 3 };

  const optionsBars = { barWidth: 10, fillStyle: 'blue', numBars: 20 };

  waveVis.bars(optionsBars);
});

audio.addEventListener('pause', () => {
  waveVis.stop();
});
waveVis.stop();

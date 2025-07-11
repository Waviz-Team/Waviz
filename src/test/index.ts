import Waviz from '../primary/waviz';

const canvas = document.getElementById('canvas');
const audio = document.getElementById('audio');
const wavizTest = new Waviz(canvas);

wavizTest.connectToHTMLElement(audio);


audio.addEventListener('play', () => {
  // const debugInfo = wavizTest.debugInfo();
  // console.log('Debug: ', debugInfo);

  // const timeData = wavizTest.getTimeDomainData();
  // console.log('Time data sample:', timeData?.slice(0, 10));

  wavizTest.wave();
});

audio.addEventListener('pause', () => {
    wavizTest.stopVis();
});

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

audio.addEventListener('pause', async () => {
    await wavizTest.stopVis();
});


// Microphone Test
document.addEventListener('click', async () => { // click anywhere to start
    try {
        const wavizTest = new Waviz(canvas, 'microphone');
        await wavizTest.wave();
    } catch (error) {
        console.error('Microphone failed:', error);
    }
}, { once: true }); // Only run once

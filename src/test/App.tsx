import React, { useRef, useEffect, useState } from 'react';
import Viz from '../components/Waves/Wave4';

export default function App() {
  // audio element can take an HTMLAudioElement, microphone, or screenAudio
  const audioElement = useRef(null);
  const canvasElement = useRef(null);

  return (
    <div className='content'>
      <img src='/Logo.png' width='200' alt='Waviz Logo'></img>
      <img src='/pnpLogo.png' width='150' alt='PNP Logo'></img>

      <Viz
        srcAudio={audioElement}
        srcCanvas={canvasElement}
        // options={'blue'}
      />

      {/* Don't forget to comment out the audio tag if using microphone or screenAudio */}
      <canvas ref={canvasElement} width='500' height='500'></canvas>
      <audio ref={audioElement} src='/Motions.mp3' controls></audio>
    </div>
  );
}

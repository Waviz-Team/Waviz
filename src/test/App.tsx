import React, { useRef, useEffect, useState } from "react";
import Bar1 from "../components/Bar2-st";
import Wave1 from "../components/Wave5-st";


export default function App() {
  // audio element can take an HTMLAudioElement, microphone, or screenAudio
  const audioElement = useRef(null);
  const canvasElement = useRef(null);

  return (
    <div className="content">
      <img src="/Logo.png" width="200" alt="Waviz Logo"></img>
      <img src="/pnpLogo.png" width="150" alt="PNP Logo"></img>

    <Wave1
        srcAudio={audioElement}
        srcCanvas={canvasElement}
        options={['red', 'blue']}
      /> 



      {/* Don't forget to comment out the audio tag if using microphone or screenAudio */}
      <canvas ref={canvasElement} width="800" height="400"></canvas>
      <audio ref={audioElement} src="/FreshFocus.mp3" controls></audio>
    </div>
  );
}

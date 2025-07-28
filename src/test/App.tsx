import React, { useRef, useEffect, useState } from "react";
import Bar3v from "../components/Bar3-v";
// import Wave1 from "../components/Wave1";


export default function App() {
  // audio element can take an HTMLAudioElement, microphone, or screenAudio
  const audioElement = useRef(null);
  const canvasElement = useRef(null);

  return (
    <div className="content">
      <img src="/Logo.png" width="200" alt="Waviz Logo"></img>
      <img src="/pnpLogo.png" width="150" alt="PNP Logo"></img>

    <Bar3v
        srcAudio={audioElement}
        srcCanvas={canvasElement}
        options={['#ffb6c1', 1024, 3.0]}
      /> 



      {/* Don't forget to comment out the audio tag if using microphone or screenAudio */}
      <canvas ref={canvasElement} width="800" height="400"></canvas>
      <audio ref={audioElement} src="/FreshFocus.mp3" controls></audio>
    </div>
  );
}

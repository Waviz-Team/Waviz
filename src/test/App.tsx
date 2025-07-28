import React, { useRef, useEffect, useState } from "react";
import Bar1 from "../components/Bar1";
import Wave2 from "../components/Wave2C";
import Wave3 from "../components/Wave3C"
import Wave4 from "../components/Wave4C"
import Bar2Cate from "../components/Bar2Cate"
import Bar3 from "../components/Bar3C";
import Bar4 from "../components/Bar4C";
import Bar5 from "../components/Bar5C";



export default function App() {
  // audio element can take an HTMLAudioElement, microphone, or screenAudio
  const audioElement = useRef(null);
  const canvasElement = useRef(null);

  return (
    <div className="content">
      <img src="/Logo.png" width="200" alt="Waviz Logo"></img>
      <img src="/pnpLogo.png" width="150" alt="PNP Logo"></img>

    <Bar2Cate
        srcAudio={audioElement}
        srcCanvas={canvasElement}
        // options={['red',5]}
      /> 



      {/* Don't forget to comment out the audio tag if using microphone or screenAudio */}
      <canvas ref={canvasElement} width="800" height="400"></canvas>
      <audio ref={audioElement} src="/FreshFocus.mp3" controls></audio>
    </div>
  );
}

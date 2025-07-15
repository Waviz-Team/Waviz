import React, { useRef, useEffect, useState } from "react";
import WaveComponent from "./components/WaveComponent";
import BarComponent from "./components/BarComponent";

export default function App() {
  // audio element can take an HTMLAudioElement, microphone, or screenAudio
  const audioElement = useRef(null);
  const canvasElement = useRef(null);

  return (
    <div className="content">
      <img src="/Logo.png" width="200"></img>
      <img src="/pnpLogo.png" width="150"></img>

      {/* <WaveComponent
        srcAudio={audioElement}
        srcCanvas={canvasElement}
        options={{ lineColor: "blue", lineWidth: 2, multiplier: 1 }}
      /> */}

      <BarComponent
        srcAudio={audioElement}
        srcCanvas={canvasElement}
        options={{barWidth: 20, fillStyle:"green", numBars: 10}}
      
      />


      {/* Don't forget to comment out the audio tag if using microphone or screenAudio */}
      <canvas ref={canvasElement} width="800" height="400"></canvas>
      <audio ref={audioElement} src="/FreshFocus.mp3" controls></audio>
    </div>
  );
}

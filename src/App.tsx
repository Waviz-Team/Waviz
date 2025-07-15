import React, { useRef, useEffect, useState } from "react";
import WaveComponent from "./components/WaveComponent";

export default function App() {
  // audio element can take an HTMLAudioElement, microphone, or screenAudio
const audioElement = useRef(null);
const canvasElement = useRef(null);
  
  return (
    <div className="content">
      <img src="/Logo.png" width="200"></img>
      <img src="/pnpLogo.png" width="150"></img>
      
      {/* Don't forget to comment out the audio tag if using microphone or screenAudio */}
      {/* <canvas ref={canvasElement} width='600' height='300'></canvas> */}

      <WaveComponent
        src={audioElement}
        // srcCanvas={canvasElement}
        options = {{lineColor:"blue",lineWidth:2, multiplier:1}}
        
      />
      <audio ref={audioElement} src="/FreshFocus.mp3" controls></audio>
    </div>
  );
}

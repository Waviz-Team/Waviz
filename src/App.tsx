import React, { useRef, useEffect, useState } from "react";
import WaveComponent from "./components/WaveComponent";

export default function App() {
const microphoneStream = await navigator.mediaDevices.getUserMedia({ 
    audio: true 
});
  const audioElement = useRef(microphoneStream);

  return (
    <div className="content">
      <img src="/Logo.png" width="200"></img>
      <img src="/pnpLogo.png" width="150"></img>
      
      {/* <audio ref={audioElement} src="/FreshFocus.mp3" controls></audio> */}

      <WaveComponent
        src={audioElement}
        options = {{lineColor:"blue",lineWidth:2, multiplier:1}}
      />
    </div>
  );
}

// microphone
// screenAudio
// File string

// MediaStream

// Audio Element


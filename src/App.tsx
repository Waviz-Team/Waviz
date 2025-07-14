import React, {useRef, useEffect, useState} from 'react';
import WaveComponent from './components/WaveComponent'; 

export default function App() {
  const audioElement = useRef(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(()=>{
if(audioElement.current){
  setIsReady(true)
}
  console.log("audio element",audioElement.current)
},[audioElement])
  
return (
    <div className='content'>
      <img src='/Logo.png' width='200'></img>
      <img src='/pnpLogo.png' width='150'></img>
      <audio ref={audioElement} src='/FreshFocus.mp3' controls></audio>
      <h1>HELLO</h1>
      {isReady && <WaveComponent
        src={audioElement.current}   
        lineColor= "blue"
        lineWidth={2}
        multiplier={1}
        />
      }
     
    </div>
  );
}
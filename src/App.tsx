import React from 'react';
import PlugPlayComponent from './components/PlugPlayComponent'; 

export default function App() {
  return (
    <div >
      <h1>Waviz Plug-and-Play</h1>
      <PlugPlayComponent
        src="Lana Del Rey - Born To Die.mp3"
        lineColor="blue"
        lineWidth={2}
        multipliyer={1}
      />
    </div>
  );
}
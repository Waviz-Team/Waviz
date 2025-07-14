import React from 'react';
import PlugPlayComponent from './components/PlugPlayComponent'; 

export default function App() {
  return (
    <div className='content'>
      <img src='/Logo.png' width='200'></img>
      <img src='/pnpLogo.png' width='150'></img>
      <PlugPlayComponent
        src="/FreshFocus.mp3"
        lineColor="lightBlue"
        lineWidth={2}
        multipliyer={1}
      />
    </div>
  );
}
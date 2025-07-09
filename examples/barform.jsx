import React, { useEffect, useRef } from 'react';
import Input from "../src/input/input";
import AudioAnalyzer from "../src/analysers/analyzer";

function BarExample() {
    const inputRef = useRef(null);
    const analyzerRef = useRef(null);

    useEffect(() => {
        analyzerRef.current = new AudioAnalyzer();

        inputRef.current = new Input((sourceNode) => {
            const audioContext = inputRef.current.getAudioContext();
            if (audioContext && analyzerRef.current) {
                analyzerRef.current.startAnalysis(audioContext, sourceNode)

                console.log(analyzerRef.current.getFrequencyData());
            }
        })

        const testAudio = new Audio('../public/Funshine.mp3');
        testAudio.crossOrigin = "anonymous";
        testAudio.controls = true;
        inputRef.current.connectToAudioElement(testAudio);

        return () => {
            if (inputRef.current) {
                inputRef.current.cleanup();
            }
        }
    }, []);

    return (
        <div>
            {}
        </div>
    )
}
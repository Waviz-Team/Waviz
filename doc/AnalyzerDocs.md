### AudioAnalyzer Class
The purpose of the analyzer class is to provide an in-house analyzer for audio data while maintaining a clear separation of concerns. The analyzer uses methods pre-defined on webAudio API to conduct Fourier transformations on a given audio context. startAnalysis takes two mandatory arguments: audioContext and sourceNode. sourceNode must be an AudioNode that we can connect to in order to run the analysis. 

### Methods
**startAnalysis( ):** The primary method of the audioAnalyzer class. It will run a Fourier analysis on the audioContext using .createAnalyser() defined by WebAudioApi. By default, it will take a fftSize of 2048. *Future Update: Allow users to dynamically change fftSize!*

**API Methods:**
* getFrequencyData( ) - allows users/functions to pull the array of frequency data mapped by FFT in bins to access. The array will be of type 8-bit unsigned integers with an array length of 1/2 the fftSize. 
* getTimeDomainData( ) - allows users/functions to pull the array of time mapped data by FFT in bins to access. The array will be of type 8-bit unsigned integers with an array length of 1/2 the fftSize.
* getDataArray( ) - allows users/functions to grab the raw freq data in type 8-bit unsigned integers. 
* getBufferLength( ) - this will output the frequency bin count as a number, which will be 1/2 the fftSize.
* get timeData( ) - a getter function that outputs the same result as getTimeDomainData(). This is here in case users want to access live data via a getter function instead. 
* get freqData( ) - a getter function that outputs the same result as getFrequencyData(). This is here in case users want to access live data via a getter function instead. 
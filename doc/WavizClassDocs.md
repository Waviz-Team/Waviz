### Waviz Class
The purpose of the Waviz class is to provide a wrapper class for all the modularized classes we have defined below (input, analyzer, visualizer) through class composition. If you want a simple, effective way to create a visualizer that isn't a react component, use this class! The Waviz class takes in 3 optional arguments: 
* canvas - type should be an HTML Canvas Element. We need a provided user canvas to draw our visualizer on! 
* audioSource - type will be the same type defined in the Input class .connectAudioSource() below. This is necessary as well if you want to start the visualizer!
* audioContext - type will be an AudioContext. This is the currently the only optional parameter that is not needed to start the visualizer. However, if an audioContext has already been established and you don't want to duplicate audioContext (you probably shouldn't), then you can pass in your already existing audioContext. This is also helpful in the case you want to create multiple visualizers on the same page. 
All 3 arguments are not needed to initialize the class. However, the first two (canvas, audioSource) should be passed in if you want to start the visualizer. Using these arguments, the Waviz class will auto initialize the visualizer/audioContext for you. 

### Methods
**Delegator Methods:**
* getFrequencyData( ) - pulls the frequency data while providing sanity checks. For more details, refer to our audioAnalyzer documentation!
* getTimeDomainData( ) - pulls the time domain data while providing sanity checks. For more details, refer to our audioAnalyzer documentation!
* cleanup( ) - delegation of the cleanup from our Input class with sanity checks. This will clean up the audioContext and disconnect the sourceNode. 

**Convenience Methods:**
* simpleLine( ) - takes in the optional arguments of options (for the full list of options, refer to the visualizer documentation!). This will initialize a simple wave visualizer with a line. ***If using mediaStream inputs, make sure to call within an event listener, tied to a user gesture, in order to comply with browser autoplay and permission policies!***
* simpleBars ( ) - takes in the optional arguments of options (for the full list of options, refer to the visualizer documentation!). This will initialize a basic bar visualizer for you. ***If using mediaStream inputs, make sure to call within an event listener, tied to a user gesture, in order to comply with browser autoplay and permission policies!***
* simplePolarLine( ) - same as simpleLine except mapped over a circle/polar coordinates.
* simplePolarBars( ) - same as simpleBars execpet mapped over a circle/polar coordinates.
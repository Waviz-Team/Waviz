### Input Class
The purpose of the Input class is to help initialize an audio analyzer as well as identify the different types of audio/signals. The Input Class takes in two optional argument: a callback and an audioContext. The callback (tailored for an audio analyzer) must be initialized in order to use the other methods. The audioContext should only be passed if an audio context has already been set up. Otherwise, our Input class will create an audioContext by default for the user. ***If using mediaStream methods, make sure to call on them within an event listener tied to a user gesture to stay in line with CORS policy!***

### Methods
**connectAudioSource( ):** A router that takes in an audioSource as an argument. This will route the audio to correct managers that we have pre-defined. The current audio supported are: 
* HTML Audio elements (defined as a HTML Audio Element)
* HTML Video elements (defined as a HTML Video Element)
* Local File inputs 
* URL/path strings to media files (defined as a string path)
* Microphone (defined by 'microphone') - This will require user permission for microphone access of the tab.
* Tab Audio (defined by 'screenAudio')- ***Warning: This feature is currently only supported by Chromium Browsers. It will require user permission for screen video capture of the tab. Will only capture current tab. This may change in the future. Refer to MDN docs for up-to-date support: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia***
* MediaStream input (defined by an await statement of a mediaStream) - Highly recommend only using pre-defined methods if it exists for the mediaStream. This input will not have sanity checks and is here for edge cases/more flexibility and control for the user. 

**Handlers:** We currently have two primary handlers for an audio input.
* connectToAudioElement( ) - takes in an audio element as an argument. This will handle local files, htmls, and URL strings/paths to audio.
* connectToMediaStream( ) - takes in a stream element as an argument. This will handle all mediaStream connections.

**initializePending( ):** This method is important for waiting for the async user permissions (for media streams). Without this wait, a connection will be set up without waiting for permission, leading to a permanently suspended audio context. 
* Make sure to call this method before calling a visualizer function to prevent problem listed above!
* This method also acts as a middleware router for Microphone and screenAudio!

**Local audio methods. All methods here route to connectToAudioElement**
* loadAudioFile( ) - takes in an event from an event handler and routes to the handler. 
* connectToAudioURL( ) - takes in a string. String should point to the path of an audio file. 
* connectToHTMLElement( ) - takes in an existing HTML audio/video element to process through WebAudioAPI. It is currently tied to an event listener listening for 'play' to resume audio context. 

**MediaStream methods. All methods here route to connectToMediaStream( ):**
* connectToMicrophone( ) - is routed from initializePending(). Sets up access to user microphone through the browser. *supported by most modern browsers (chrome, firefox, safari, edge)*
* connectToScreenAudio( ) - is routed from initializePending(). Sets up access to user tab audio via getDisplayMedia(). It is limited to the tab in which the application is contained within. It does this by grabbing video access, and then turning off video while keeping audio from the video feed. Without this, audio cannot be grabbed. This feature is currently only supported by Chromium Browsers (*Subject to change - refer to MDN documentation). 

**API Methods:**
* getSourceNode( ) - if you want to figure out which sourceNode is being passed in
* getAudioContext( ) - to get the current used audioContext
* cleanup( ) - this will clear the current audioContext and disconnect the sourceNode. To reaccess features, a re-initialization of the audioContext/sourceNode will be necessary. 
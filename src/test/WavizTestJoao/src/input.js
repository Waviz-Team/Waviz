export class input {
  audioCtx;
  audioSrc;

  constructor(audio) {
    this.audioCtx = new AudioContext();
    this.audioSrc = this.audioCtx.createMediaElementSource(audio);
    this.audioSrc.connect(this.audioCtx.destination);
  }
}

export class analyser {
  audioCtx;
  audioSrc;
  analyser;
  bufferLength;
  dataArray;

  constructor(input) {
    this.audioCtx = input.audioCtx;
    this.audioSrc = input.audioSrc;
    this.analyser = this.audioCtx.createAnalyser();
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.audioSrc.connect(this.analyser);
  }

  getFrequency() {
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  getTime() {
    this.analyser.getByteTimeDomainData(this.dataArray);
    return this.dataArray;
  }
}

import { input } from './input.js';
import { analyser } from './analyser.js';
import { visualizer } from './visualizer.js';

export class waviz {
  input;
  analyser;
  visualizer;

  constructor(audio, canvas) {
    this.input = new input(audio);
    this.analyser = new analyser(this.input);
    this.visualizer = new visualizer(this.analyser, canvas);
  }
}

import { waviz } from './src/waviz.js';

const audio = document.getElementById('audio');
const canvas = document.getElementById('canvas');

const visuals = new waviz(audio, canvas);
visuals.visualizer.bars();

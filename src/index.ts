import Waviz from './core/waviz';
export default Waviz;

// Main exports for Waviz library
export { default as Waviz } from './core/waviz';
export { default as Input } from './input/input';
export { default as AudioAnalyzer } from './analysers/analyzer';
export { default as Visualizer } from './visualizers/Visualizer';
export { default as WaveComponent } from './components/Wave1';
export { default as BarComponent } from './components/BarComponent';

// Export types if needed
export interface WaveOptions {
  lineWidth?: number;
  lineColor?: string;
  multiplier?: number;
}

export interface BarOptions {
  barWidth?: number;
  fillStyle?: string;
  numBars?: number;
}

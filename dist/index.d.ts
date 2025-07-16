import Waviz from './core/waviz';
export default Waviz;
export { default as Waviz } from './core/waviz';
export { default as Input } from './input/input';
export { default as AudioAnalyzer } from './analysers/analyzer';
export { default as Visualizer } from './visualizers/Visualizer';
export { default as WaveComponent } from './components/WaveComponent';
export { default as BarComponent } from './components/BarComponent';
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

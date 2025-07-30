import Waviz from './core/waviz';
export default Waviz;

// Core library
export { default as Waviz } from './core/waviz';
export { default as Input } from './input/input';
export { default as AudioAnalyzer } from './analysers/analyzer';
export { default as Visualizer } from './visualizers/visualizer';

// Export types 
export type { IOptions, IParticle } from './types/types';
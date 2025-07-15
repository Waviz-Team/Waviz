interface Visualizer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    analyser: any;
    animationLoop: any;
}
declare class Visualizer {
    constructor(canvas: any, analyser: any);
    wave(options?: any): void;
    bars(options?: any): void;
    stop(): void;
}
export default Visualizer;

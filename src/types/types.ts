export interface IVisualizer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  data: any;
  rectData:[];
  renderLoop: any;
}
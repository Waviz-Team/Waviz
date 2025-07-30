export interface IParticle {
  canvasSize: number[];
  position: number[];
  velocity: number[];
  gravity: number;
  live: boolean;
  born: number;
  update(): void;
}

export interface IOptions {
  domain?: [string?, number?, number?, string?];

  coord?: [('rect' | 'polar')?, number?, number?, number?];
  viz?: 
    | ['line', number?] // type, # of samples
    | ['bars', number?, ('rect' | 'polar')?, number?] // type, # of bars, 'mode', innerRadius
    | ['dots', number?] // type, # of samples
    | ['particles', number[]?, number?, number?, number?, number?, number?] // type, velocity array, gravity, lifespan, birthrate, samples
    | [string, ...any[]]; // fallback for other visualizations just in case
  color?: 
    | ['linearGradient', string?, string?, string?] // type, 'color1', 'color2', 'flip'
    | ['radialGradient', string?, string?, number?, number?] // type, 'color1', 'color2', 'inner radius', 'outer radius'
    | ['randomPalette', string[]]
    | ['randomColor']
    | [string]; // fallback for simple color
  style?: [number?, string?, string?]; 
  stroke?: [number?, string?]; // number: width, string: style
  fill?: ['solid' | 'linearGradient', string | [string, string], string?]; // fill type, style (i.e dashes)
}

declare global { // Needed to extend global scope of 'DisplayMediaStreamOptions' with the currentTab that is only supported in Chromium
    interface DisplayMediaStreamOptions {
        preferCurrentTab?: boolean;
    }
}
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
    viz?: ['line', number?] | ['bars', number?, ('rect' | 'polar')?, number?] | ['dots', number?] | ['particles', number[]?, number?, number?, number?, number?, number?] | [string, ...any[]];
    color?: ['linearGradient', string?, string?, string?] | ['radialGradient', string?, string?, number?, number?] | ['randomPalette', string[]] | ['randomColor'] | [string];
    style?: [number?, string?, string?];
    stroke?: [number?, string?];
    fill?: ['solid' | 'linearGradient', string | [string, string], string?];
}

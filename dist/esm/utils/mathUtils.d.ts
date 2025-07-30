export declare function mapRange(value: any, inMin: any, inMax: any, outMin: any, outMax: any): any;
export declare function mapArray(array: any, inMin: any, inMax: any, outMin: any, outMax: any): any;
export declare function polarInter(input: number[], blendCount: number): number[];
export declare function makePeriodic(input: number[]): number[];
export declare function hanWindow(input: number[]): number[];
export declare function hammingWindow(input: number[]): number[];
export declare function exponentialWindow(input: number[], a?: number): number[];
export declare function blackmanHarrisWindow(input: number[]): number[];
export declare const windowFunc: {
    hann: typeof hanWindow;
    hamming: typeof hammingWindow;
    exponential: typeof exponentialWindow;
    bHarris: typeof blackmanHarrisWindow;
};

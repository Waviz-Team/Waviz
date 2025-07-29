"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.windowFunc = void 0;
exports.mapRange = mapRange;
exports.mapArray = mapArray;
exports.polarInter = polarInter;
exports.makePeriodic = makePeriodic;
exports.hanWindow = hanWindow;
exports.hammingWindow = hammingWindow;
exports.exponentialWindow = exponentialWindow;
exports.blackmanHarrisWindow = blackmanHarrisWindow;
// Maps value to new range
function mapRange(value, inMin, inMax, outMin, outMax) {
    if (inMax === inMin) {
        return outMin;
    }
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
// Maps arrayf of values to new range
function mapArray(array, inMin, inMax, outMin, outMax) {
    return array.map((e) => mapRange(e, inMin, inMax, outMin, outMax));
}
//* Math that solves seaming issue in polar
function polarInter(input, blendCount) {
    // polar interpolation function. This function interpolates to close the gap between last and first # in data array
    const output = input.slice();
    const length = output.length;
    for (let i = 0; i < blendCount; i++) {
        const t = i / blendCount;
        output[length - blendCount + 1] =
            output[length - blendCount + i] * (1 - t) + output[i] * t;
    }
    return output;
}
function makePeriodic(input) {
    // Linear periodic extension (this will help with closing the seam between first and last value in polar vis)
    const output = input.slice();
    const length = output.length;
    const diff = output[length - 1] - output[0];
    for (let i = 0; i < length; i++) {
        output[i] -= (diff * i) / (length - 1); // output[0] === output[len-1]
    }
    return output;
}
//* Window Functions
function hanWindow(input) {
    // Hann window (used to reduce spectral leakage through a bell-shaper curve tapering)
    const N = input.length;
    return input.map((v, n) => v * (0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (N - 1))));
}
function hammingWindow(input) {
    // Hamming window (similar to hanning but with slightly modified weighting for side lobes. Useful for higher frequency resolution)
    const N = input.length;
    return input.map((v, n) => v * (0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1))));
}
function exponentialWindow(input, a = 0.01) {
    // Exponential Window (used in modal impact testing+ where emphaisis on beginning of signal is important. Good for analyzing transient signals)
    return input.map((v, n) => v * Math.exp(-a * n));
}
function blackmanHarrisWindow(input) {
    // General purpose Window good for suppressing sidelobes
    const N = input.length;
    // Default Values taken from https://www.mathworks.com/help/signal/ref/blackmanharris.html
    const a0 = 0.35875;
    const a1 = 0.48829;
    const a2 = 0.14128;
    const a3 = 0.01168;
    return input.map((v, n) => v *
        (a0 -
            a1 * Math.cos((2 * Math.PI * n) / (N - 1)) +
            a2 * Math.cos((4 * Math.PI * n) / (N - 1)) -
            a3 * Math.cos((6 * Math.PI * n) / (N - 1))));
}
exports.windowFunc = {
    hann: hanWindow,
    hamming: hammingWindow,
    exponential: exponentialWindow,
    bHarris: blackmanHarrisWindow,
};
//# sourceMappingURL=mathUtils.js.map
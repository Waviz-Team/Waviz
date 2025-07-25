// Maps value to new range
export function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) {
    return outMin;
  }
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Maps arrayf of values to new range
export function mapArray(array, inMin, inMax, outMin, outMax) {
  return array.map((e) => mapRange(e, inMin, inMax, outMin, outMax));
}

//* Math that solves seaming issue in polar

export function polarInter(input: number[], blendCount: number): number[] { // polar interpolation function. This function interpolates to close the gap between last and first # in data array
  const output = input.slice();
  const length = output.length;

  for (let i = 0; i < blendCount; i++) {
    const t = i / blendCount;
    output[length - blendCount + 1] = output[length - blendCount + i] * (1 - t) + output[i] * t;
  }

  return output;
}

export function makePeriodic(input: number[]): number[] { // Linear periodic extension (this will help with closing the seam between first and last value in polar vis)
  const output = input.slice();
  const length = output.length;
  const diff = output[length - 1] - output[0];

  for (let i = 0; i < length; i++) {
    output[i] -= (diff * i) / (length - 1);  // output[0] === output[len-1]
  }
 
  return output;
}

//* Window Functions 
export function hanWindow(input: number[]): number[] { // Hann window (used to reduce spectral leakage through a bell-shaper curve tapering)
  const N = input.length;
  return input.map((v, n) => v * (0.5 - 0.5 * Math.cos((2 * Math.PI * n) / (N - 1))));
}

export function hammingWindow(input: number[]): number[] { // Hamming window (similar to hanning but with slightly modified weighting for side lobes. Useful for higher frequency resolution)
  const N = input.length;
  return input.map((v, n) => v * (0.54 - 0.46 * Math.cos((2 * Math.PI * n) / (N - 1))));
}

export function exponentialWindow(input: number[], a: number = 0.01): number[] { // Exponential Window (used in modal impact testing+ where emphaisis on beginning of signal is important. Good for analyzing transient signals)
  return input.map((v, n) => v * Math.exp(-a * n));
}
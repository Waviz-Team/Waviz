// Maps value to new range
export function mapRange(value, inMin, inMax, outMin, outMax) {
  // Handle potential division by zero if the input range is zero
  if (inMax === inMin) {
    return outMin; // Or handle as an error, depending on requirements
  }
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Maps arrayf of values to new range
export function mapArray(array, inMin, inMax, outMin, outMax) {
  return array.map((e) => mapRange(e, inMin, inMax, outMin, outMax));
}

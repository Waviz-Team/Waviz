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
//# sourceMappingURL=mathUtils.js.map
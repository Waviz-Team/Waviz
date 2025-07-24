"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapRange = mapRange;
exports.mapArray = mapArray;
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
//# sourceMappingURL=mathUtils.js.map
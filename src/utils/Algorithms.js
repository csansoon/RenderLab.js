

/**
 * Linear interpolation between two values.
 * @param {number} a Start value
 * @param {number} b End value
 * @param {number} t Interpolation value (0-1) It represents the percentage of the interpolation
 */
function lerp(a, b, t) {
	return a + (b - a) * t;
}

export { lerp }
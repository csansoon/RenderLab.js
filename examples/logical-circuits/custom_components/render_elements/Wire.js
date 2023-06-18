import RenderElement from "../../../../src/components/RenderElement.js";

class Wire extends RenderElement {

	constructor({ from, to, color, path = [], glow = 0 }) {
		super({ position: from });
		this.from = from;
		this.to = to;
		this.color = color;
		this.path = path; // Array of points without the first and last point (from and to)
		this.glow = glow; // Glow effect (from 0 to 1)
	}

	/**
	 * Returns the bounding box of the element
	 * @returns {Object}
	 * @returns {number} left
	 * @returns {number} top
	 * @returns {number} right
	 * @returns {number} bottom
	 */
	getBoundingBox() {
		const min = { x: Math.min(this.from.x, this.to.x), y: Math.min(this.from.y, this.to.y) };
		const max = { x: Math.max(this.from.x, this.to.x), y: Math.max(this.from.y, this.to.y) };
		for (const point of this.path) {
			min.x = Math.min(min.x, point.x);
			min.y = Math.min(min.y, point.y);
			max.x = Math.max(max.x, point.x);
			max.y = Math.max(max.y, point.y);
		}

		return {
			left: min.x,
			top: min.y,
			right: max.x,
			bottom: max.y,
		};
	}

	
	/**
	 * Renders the element on the given canvas
	 * @param {CanvasRenderingContext2D} ctx Context to render on
	 * @param {Object} offset Offset to render the element at
	 * @param {number} offset.x
	 * @param {number} offset.y
	 * @param {Object} scale Scale to render the element at
	 * @param {number} scale.x
	 * @param {number} scale.y
	 * @returns {void}
	 */
	render(ctx, offset, scale) {
		const lineJoin = ctx.lineJoin;

		ctx.beginPath();

		ctx.moveTo((this.from.x + offset.x) * scale.x, (this.from.y + offset.y) * scale.y);
		for (const point of this.path) ctx.lineTo((point.x + offset.x) * scale.x, (point.y + offset.y) * scale.y);
		ctx.lineTo((this.to.x + offset.x) * scale.x, (this.to.y + offset.y) * scale.y);

		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2 * scale.x;

		// Make the line and edges rounded
		ctx.lineJoin = "round";

		ctx.stroke();

		if (this.glow > 0) {
			ctx.beginPath();

			ctx.moveTo((this.from.x + offset.x) * scale.x, (this.from.y + offset.y) * scale.y);
			for (const point of this.path) ctx.lineTo((point.x + offset.x) * scale.x, (point.y + offset.y) * scale.y);
			ctx.lineTo((this.to.x + offset.x) * scale.x, (this.to.y + offset.y) * scale.y);

			// Draw the same path with more width, transparency and a blur effect depending on the glow value
			ctx.strokeStyle = this.color;
			ctx.lineWidth = 2 * scale.x + 4 * scale.x * this.glow;
			ctx.globalAlpha = 0.25 * this.glow;
			ctx.shadowColor = this.color;
			ctx.shadowBlur = 10 * this.glow;
			ctx.stroke();

			// Reset the context values
			ctx.shadowBlur = 0;
			ctx.globalAlpha = 1;
		}

		// Reset the context values
		ctx.lineJoin = lineJoin;

	}
}

export default Wire;
import RenderElement from "../../../../src/components/RenderElement.js";

const INPUT_GAP = 24;

class DefaultComponent extends RenderElement {

	constructor({
		position = { x: 0, y: 0 },
		color = "black",
		num_inputs = 1,
		num_outputs = 1,
		width = 100, // height is calculated based on the number of inputs and outputs
		border_radius = 4,
	}) {
		super({ position });
		this.position = position;
		this.color = color;

		this.num_inputs = num_inputs;
		this.num_outputs = num_outputs;

		this.width = width;
		this.height = (Math.max(num_inputs, num_outputs) + 1) * INPUT_GAP;
		this.border_radius = border_radius;
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
		return {
			left: this.position.x,
			top: this.position.y,
			right: this.position.x + this.width,
			bottom: this.position.y + this.height,
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

		const x = (this.position.x + offset.x) * scale.x;
		const y = (this.position.y + offset.y) * scale.y;
		const width = this.width * scale.x;
		const height = this.height * scale.y;
		const border_radius = this.border_radius * scale.x;

		ctx.fillStyle = this.color;
		
		// Draw body (rectangle with rounded corners)
		ctx.beginPath();
		ctx.moveTo(x + border_radius, y);
		ctx.lineTo(x + width - border_radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + border_radius);
		ctx.lineTo(x + width, y + height - border_radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - border_radius, y + height);
		ctx.lineTo(x + border_radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - border_radius);
		ctx.lineTo(x, y + border_radius);
		ctx.quadraticCurveTo(x, y, x + border_radius, y);
		ctx.fill();

		// Draw inputs and outputs
		const radius = 4 * scale.x;
		ctx.fillStyle = this.color;
		ctx.globalAlpha = 0.5;

		for (let i = 0; i < this.num_inputs; i++) {
			ctx.beginPath();
			ctx.arc(x, y + (i + 1) * INPUT_GAP * scale.y, radius, 0, 2 * Math.PI);
			ctx.fill();
		}

		for (let i = 0; i < this.num_outputs; i++) {
			ctx.beginPath();
			ctx.arc(x + width, y + (i + 1) * INPUT_GAP * scale.y, radius, 0, 2 * Math.PI);
			ctx.fill();
		}

		// Reset alpha
		ctx.globalAlpha = 1;
	}
}

export default DefaultComponent;
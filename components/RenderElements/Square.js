import RenderElement from "../RenderElement.js";

class Square extends RenderElement {

	/**
	 * Creates a new Square
	 * @param {Object} position Position of the element
	 * @param {number} position.x
	 * @param {number} position.y
	 * @param {Object} size Size of the box
	 * @param {number} size.x
	 * @param {number} size.y
	 * @param {number} thickness Thickness of the outline
	 * @param {string} color Color of the box
	 */
	constructor({
		position = { x: 0, y: 0 },
		size = { x: 1, y: 1 },
		thickness = 1,
		color = "black",
	}) {
		super({ position });
		this.size = size;
		this.color = color;
		this.thickness = thickness;
	}

	getBoundingBox() {
		return {
			left: this.position.x,
			top: this.position.y,
			right: this.position.x + this.size.x,
			bottom: this.position.y + this.size.y
		};
	}

	render(ctx, offset, scale) {
		const x = (this.position.x + offset.x) * scale.x;
		const y = (this.position.y + offset.y) * scale.y;
		const width = this.size.x * scale.x;
		const height = this.size.y * scale.y;

		// Draw the outline of a square

		ctx.fillStyle = this.color;
		ctx.fillRect(x, y, width, this.thickness);
		ctx.fillRect(x, y, this.thickness, height);
		ctx.fillRect(x + width - this.thickness, y, this.thickness, height);
		ctx.fillRect(x, y + height - this.thickness, width, this.thickness);

	}
}

export default Square;
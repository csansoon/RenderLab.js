import RenderElement from "../RenderElement.js";

class Box extends RenderElement {
	/**
	 * Creates a new Box
	 * @param {Object} position Position of the element
	 * @param {number} position.x
	 * @param {number} position.y
	 * @param {Object} size Size of the box
	 * @param {number} size.x
	 * @param {number} size.y
	 * @param {string} color Color of the box
	 */
	constructor({
		position = { x: 0, y: 0 },
		size = { x: 1, y: 1 },
		color = "black",
	}) {
		super({ position });
		this.size = size;
		this.color = color;
	}


	/* -------------------------------- Get data -------------------------------- */

	/**
	 * Returns the size of the box
	 * @returns {Object} Size of the box
	 * @returns {number} Size.x
	 * @returns {number} Size.y
	 * @returns {string} Color of the box
	 */
	getSize() {
		return this.size;
	}

	
	/**
	 * Returns the color of the box
	 * @returns {string} Color of the box
	 */
	getColor() {
		return this.color;
	}


	/* ------------------------------- Modify data ------------------------------ */

	/**
	 * Sets the size of the box
	 * @param {Object} size Size of the box
	 * @param {number} size.x
	 * @param {number} size.y
	 * @returns {void}
	 */
	setSize(size) {
		this.size = size;
	}


	/**
	 * Sets the color of the box
	 * @param {string} color Color of the box
	 * @returns {void}
	 */
	setColor(color) {
		this.color = color;
	}



	/* --------------------------------- Actions -------------------------------- */

	getBoundingBox() {
		return {
			left: this.position.x,
			top: this.position.y,
			right: this.position.x + this.size.x,
			bottom: this.position.y + this.size.y,
		};
	}

	render(ctx, offset, scale) {
		const x = (this.position.x + offset.x) * scale.x;
		const y = (this.position.y + offset.y) * scale.y;
		const width = this.size.x * scale.x;
		const height = this.size.y * scale.y;

		ctx.fillStyle = this.color;
		ctx.fillRect(x, y, width, height);
	}
}

export default Box;
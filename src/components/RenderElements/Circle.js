import RenderElement from "../RenderElement.js";

class Circle extends RenderElement {

	/**
	 * Creates a new Circle
	 * @param {Object} position Position of the element
	 * @param {number} position.x
	 * @param {number} position.y
	 * @param {number} radius Radius of the circle
	 * @param {string} color Color of the circle
	 */
	constructor({
		position = { x: 0, y: 0 },
		radius = 1,
		color = "black",
	}) {
		super({ position });
		this.radius = radius;
		this.color = color;
	}


	/* -------------------------------- Get data -------------------------------- */

	/**
	 * Returns the radius of the circle
	 * @returns {number} Radius of the circle
	 */
	getRadius() {
		return this.radius;
	}


	/**
	 * Returns the color of the circle
	 * @returns {string} Color of the circle
	 */
	getColor() {
		return this.color;
	}


	/* ------------------------------- Modify data ------------------------------ */

	/**
	 * Sets the radius of the circle
	 * @param {number} radius Radius of the circle
	 * @returns {void}
	 */
	setRadius(radius) {
		this.radius = radius;
	}


	/**
	 * Sets the color of the circle
	 * @param {string} color Color of the circle
	 * @returns {void}
	 */
	setColor(color) {
		this.color = color;
	}


	/* --------------------------------- Actions -------------------------------- */

	getBoundingBox() {
		return {
			left: this.position.x - this.radius,
			top: this.position.y - this.radius,
			right: this.position.x + this.radius,
			bottom: this.position.y + this.radius,
		};
	}

	
	render(ctx, offset, scale) {
		const x = (this.position.x + offset.x) * scale.x;
		const y = (this.position.y + offset.y) * scale.y;
		const radius = this.radius * scale.x;

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fill();
	}
}

export default Circle;
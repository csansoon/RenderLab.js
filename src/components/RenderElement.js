import { lerp } from "../utils/Algorithms.js";
class RenderElement {

	/**
	 * Creates a new RenderElement
	 * @param {Object} position Position of the element
	 * @param {number} position.x
	 * @param {number} position.y
	 */
	constructor({
		position = { x: 0, y: 0 },
	}) {
		this.position = position;
	}


	/* -------------------------------- Get data -------------------------------- */

	/**
	 * Returns the position of the element
	 * @returns {Object}
	 * @returns {number} position.x
	 * @returns {number} position.y
	 */
	getPosition() {
		return this.position;
	}


	/* ------------------------------- Modify data ------------------------------ */

	/**
	 * Sets the position of the element
	 * @param {Object} position Position of the element
	 * @param {number} position.x
	 * @param {number} position.y
	 */
	setPosition(position) {
		this.position = position;
	}


	/**
	 * Moves the element
	 * @param {Object|number} delta Delta to move the element
	 * @param {number} delta.x
	 * @param {number} delta.y
	 * @returns {void}
	 */
	move(delta) {
		if (typeof delta === 'number') delta = { x: delta, y: delta };
		this.position.x += delta.x;
		this.position.y += delta.y;
	}

	/**
	 * Moves the element towards a position following a lerping function
	 * @param {Object} position Position to move towards
	 * @param {number} position.x
	 * @param {number} position.y
	 * @param {number} interpolation Interpolation value (0-1). It represents the percentage of the interpolation
	 * @returns {void}
	 */
	lerpTo(position, interpolation) {
		this.position.x = lerp(this.position.x, position.x, interpolation);
		this.position.y = lerp(this.position.y, position.y, interpolation);
	}


	/* --------------------------------- Actions -------------------------------- */

	/**
	 * Returns the bounding box of the element
	 * @returns {Object}
	 * @returns {number} left
	 * @returns {number} top
	 * @returns {number} right
	 * @returns {number} bottom
	 */
	getBoundingBox() {
		throw new Error("getBoundingBox() not implemented");
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
		throw new Error("render() not implemented");
	}

}

export default RenderElement;
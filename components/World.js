import Viewport from './Viewport.js';

class World {
	constructor() {
		this.elements = [];
	}

	/**
	 * Creates a viewport for this world
	 * @param {Object} position Position of the viewport in the world
	 * @param {number} position.x
	 * @param {number} position.y
	 * @param {Object} size Size of the viewport in the world
	 * @param {number} size.x
	 * @param {number} size.y
	 * @param {HTMLCanvasElement} canvas Canvas to render the viewport on
	 * @returns {Viewport}
	 */
	getViewport(canvas, position, size) {
		return new Viewport(position, size, canvas, this);
	}

	/**
	 * Creates a new viewport for this world in the DOM
	 * @param {HTMLElement|string} element Element to create the viewport in
	 * @param {Object} position Position of the viewport in the world
	 * @param {number} position.x
	 * @param {number} position.y
	 * @param {number} scale Scale of the viewport in the world
	 */
	createViewport(
		element,
		position = { x: 0, y: 0 },
		scale = 1
	) {
		return Viewport.createViewport(element, this, position, scale);
	}

	/**
	 * Adds an element to the world
	 * @param {RenderElement} element Element to add to the world
	 * @returns {void}
	 */
	add(element) {
		if (!element.getBoundingBox || !element.render)
			throw new Error("Element must be a RenderElement");
		this.elements.push(element);
	}

	/**
	 * Returns an array of all of the element visible in an area
	 * @param {Object} position Position of the area in the world
	 * @param {number} position.x
	 * @param {number} position.y
	 * @param {Object} size Size of the area in the world
	 * @param {number} size.x
	 * @param {number} size.y
	 * @returns {RenderElement[]}
	 */
	getElementsInArea(position, size) {
		return this.elements.filter((element) => {
			const boundingBox = element.getBoundingBox();
			return (
				boundingBox.right > position.x &&
				boundingBox.bottom > position.y &&
				boundingBox.left < position.x + size.x &&
				boundingBox.top < position.y + size.y
			);
		});
	}
}

export default World;
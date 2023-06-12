
class Viewport {

	constructor(position, size, canvas, world) {
		this.position = position;
		this.size = size;
		this.canvas = canvas;
		this.world = world;

		this.ctx = canvas.getContext('2d');
	}

	/**
	 * Sets the position of the viewport in the world
	 * @param {Object} worldPosition Position of the viewport in the world
	 * @param {number} worldPosition.x
	 * @param {number} worldPosition.y
	 * @returns {void}
	 */
	setPosition(worldPosition) {
		this.position = worldPosition;
		this.render();
	}

	/**
	 * Moves the viewport in the world
	 * @param {Object} worldDelta Delta to move the viewport in the world
	 * @param {number} worldDelta.x
	 * @param {number} worldDelta.y
	 * @returns {void}
	 */
	move(worldDelta) {
		this.position.x += worldDelta.x;
		this.position.y += worldDelta.y;
		this.render();
	}

	/**
	 * Sets the size of the viewport
	 * @param {Object} worldSize Size of the viewport in the world
	 * @param {number} worldSize.x
	 * @param {number} worldSize.y
	 * @returns {void}
	 */
	setSize(worldSize) {
		this.size.x = worldSize.x;
		this.size.y = worldSize.y;
		this.render();
	}

	/**
	 * Scales the viewport
	 * @param {Object|number} delta Delta to scale the viewport
	 * @param {number} delta.x
	 * @param {number} delta.y
	 * @returns {void}
	 */
	scale(delta) {
		if (typeof delta === 'number') delta = { x: delta, y: delta };
		this.size.x *= delta.x;
		this.size.y *= delta.y;
		this.render();
	}

	/**
	 * Gets the position of the viewport in the world for a given position in the viewport
	 * @param {Object} viewportPosition Position of the viewport
	 * @param {number} viewportPosition.x
	 * @param {number} viewportPosition.y
	 * @returns {Object} Position of the viewport in the world
	 * @returns {number} Position.x
	 * @returns {number} Position.y
	 */
	getWorldPosition(viewportPosition) {
		return {
			x: viewportPosition.x / this.canvas.width * this.size.x + this.position.x,
			y: viewportPosition.y / this.canvas.height * this.size.y + this.position.y
		};
	}

	/**
	 * Gets the delta to move the viewport in the world for a given delta to move the viewport
	 * @param {Object} viewportDelta Delta to move the viewport
	 * @param {number} viewportDelta.x
	 * @param {number} viewportDelta.y
	 * @returns {Object} Delta to move the viewport in the world
	 * @returns {number} Delta.x
	 * @returns {number} Delta.y
	 */
	getWorldDelta(viewportDelta) {
		return {
			x: viewportDelta.x / this.canvas.width * this.size.x,
			y: viewportDelta.y / this.canvas.height * this.size.y
		};
	}

	/**
	 * Renders the viewport
	 * @returns {void}
	 */
	render() {
		const renderElements = this.world.getElementsInArea(this.position, this.size);
		const offset = {
			x: -this.position.x,
			y: -this.position.y
		};
		const scale = {
			x: this.canvas.width / this.size.x,
			y: this.canvas.height / this.size.y
		}

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		renderElements.forEach(element => {
			element.render(this.ctx, offset, scale);
		});
	}

}

export default Viewport;
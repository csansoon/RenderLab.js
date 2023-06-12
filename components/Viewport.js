
class Viewport {

	constructor(position, size, canvas, world) {
		this.position = position;
		this.size = size;
		this.canvas = canvas;
		this.world = world;

		this.ctx = canvas.getContext('2d');

		this.interval = undefined;
		this.current_framerate = undefined;
		this.last_frame_time = undefined;
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

		if (this.current_framerate) {
			this.ctx.fillStyle = '#000';
			this.ctx.font = '12px sans-serif';
			this.ctx.fillText(this.current_framerate.toFixed(2), 10, 20);
		}
	}

	render_cycle() {
		const time = Date.now();

		if (this.last_frame_time) {
			const delta = time - this.last_frame_time;
			this.current_framerate = 1000 / delta;
		}

		this.last_frame_time = time;
		this.render();
	}

	/**
	 * Starts rendering the viewport at a given framerate
	 * @param {number} framerate Framerate to render the viewport at (in frames per second)
	 * @returns {void}
	 */
	start(framerate) {
		if (this.interval) this.stop();

		this.render_cycle();
		this.interval = setInterval(() => this.render_cycle(), 1000 / framerate);
	}

	/**
	 * Stops rendering the viewport
	 * @returns {void}
	 */
	stop() {
		clearInterval(this.interval);
		this.interval = undefined;
		this.last_frame_time = undefined;
		this.current_framerate = undefined;
	}

}

export default Viewport;
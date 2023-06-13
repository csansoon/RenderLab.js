import { Square } from './RenderElements.js';

class Viewport {

	constructor(position, size, canvas, world, renderElement = undefined) {
		this.position = position;
		this.size = size;
		this.canvas = canvas;
		this.world = world;

		this.ctx = canvas.getContext('2d');

		this.active = false;
		this.timeout = undefined;
		this.current_framerate = undefined;
		this.last_frame_time = undefined;

		this.renderElement = renderElement;
	}

	/**
	 * Creates the canvas element for the viewport, adds it to the DOM, and returns it
	 * @param {HTMLElement|string} element Element to create the viewport in
	 * @param {Object} position Position of the viewport in the world
	 * @param {number} position.x
	 * @param {number} position.y
	 * @param {Object|number} scale Scale of the viewport in the world
	 * @param {number} scale.x
	 * @param {number} scale.y
	 * @param {Object} options Options for the viewport
	 * @param {boolean} options.autoResize Whether or not the viewport should resize when the window resizes. Defaults to true
	 * @param {boolean} options.moveOnDrag Whether or not the viewport should move when dragged. Defaults to true
	 * @param {boolean} options.zoomOnScroll Whether or not the viewport should zoom when scrolled. Defaults to true
	 * @param {boolean} options.visibleOnWorld Whether or not the viewport should be visible on the world. Defaults to false
	 * @param {RenderElement} options.representationElement Element to represent the viewport on the world. Defaults to a black square
	 */
	static createViewport({
		element,
		world,
		position = { x: 0, y: 0 },
		scale = 1,
		options = {}
	}) {
		options = {...{ // Default options
			autoResize: true,
			moveOnDrag: true,
			zoomOnScroll: true,
			visibleOnWorld: false,
			representationElement: new Square({ thickness: 1, color: "black" }),
		}, ...options };
		
		if (typeof element === 'string') {
			element = document.querySelector(element);
			if (!element) throw new ViewportError(`Element "${element}" not found`);
		}
		if (!(element instanceof HTMLElement)) throw new ViewportError("Element must be an HTMLElement");

		const canvas = document.createElement('canvas');
		canvas.classList.add('viewport');

		element.classList.add('viewport_container');
		element.appendChild(canvas);

		const elementSize = element.getBoundingClientRect();
		const size = { x: elementSize.width / scale, y: elementSize.height / scale };
		canvas.width = size.x;
		canvas.height = size.y;

		const viewport = new Viewport(position, size, canvas, world);

		// Options
		if (options.autoResize) viewport.addResizeListener();
		if (options.moveOnDrag) viewport.addDragListener();
		if (options.zoomOnScroll) viewport.addZoomListener();
		console.log("visible on world", options.visibleOnWorld);
		if (options.visibleOnWorld) {
			viewport.renderElement = options.representationElement;
			viewport.renderElement.setPosition(position);
			viewport.renderElement.size = size;
			world.add(viewport.renderElement);
		}

		setTimeout(() => viewport.render(), 0);

		return viewport;
	}


	/* --------------------------------- Actions -------------------------------- */

	/**
	 * Sets the position of the viewport in the world
	 * @param {Object} worldPosition Position of the viewport in the world
	 * @param {number} worldPosition.x
	 * @param {number} worldPosition.y
	 * @returns {void}
	 */
	setPosition(worldPosition) {
		this.position = worldPosition;

		if (this.renderElement) this.renderElement.setPosition(this.position);

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
		this.setPosition({
			x: this.position.x + worldDelta.x,
			y: this.position.y + worldDelta.y
		})
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

		if (this.renderElement) this.renderElement.setSize(this.size);

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
		this.setSize({
			x: this.size.x * delta.x,
			y: this.size.y * delta.y
		});
	}


	/* ---------------------------------- Data ---------------------------------- */

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


	/* -------------------------------- Rendering ------------------------------- */

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


	/**
	 * Renders the viewport and schedules the next render for the given framerate
	 * @param {number} framerate Framerate to render the viewport at (in frames per second)
	 * @returns {void}
	 */
	render_cycle(frametime) {
		const time = Date.now();

		if (this.last_frame_time) {
			const delta = time - this.last_frame_time;
			this.current_framerate = 1000 / delta;
		}

		this.render();

		const current_frame_time = Date.now() - time;
		const time_to_next_frame = Math.max(0, frametime - current_frame_time);
		this.timeout = setTimeout(() => this.render_cycle(frametime), time_to_next_frame);

		this.last_frame_time = time;
	}


	/**
	 * Starts rendering the viewport at a given framerate
	 * @param {number} framerate Framerate to render the viewport at (in frames per second)
	 * @returns {void}
	 */
	start(framerate = 30) {
		if (this.active) this.stop();
		const frametime = 1000 / framerate;
		this.render_cycle(frametime);
	}


	/**
	 * Stops rendering the viewport
	 * @returns {void}
	 */
	stop() {
		clearTimeout(this.timeout);
		this.active = false;
		this.last_frame_time = undefined;
		this.current_framerate = undefined;
	}


	/* ------------------------------- Listeners -------------------------------- */

	/**
	 * Adds a listener to the viewport
	 * @param {string} event Event to listen to
	 * @param {Function} callback Callback to call when the event is triggered
	 * @returns {void}
	 */
	addListener(event, callback) {
		const windowEvents = ['resize'];
		if (windowEvents.includes(event)) window.addEventListener(event, callback);
		else this.canvas.addEventListener(event, callback);

	}

	/**
	 * Removes a listener from the viewport
	 * @param {string} event Event to remove the listener from
	 * @param {Function} callback Callback to remove from the event
	 * @returns {void}
	 */
	removeListener(event, callback) {
		const windowEvents = ['resize'];
		if (windowEvents.includes(event)) window.removeEventListener(event, callback);
		else this.canvas.removeEventListener(event, callback);
	}

	/**
	 * Adds a listener to the viewport to resize its world size when the canvas is resized
	 * @returns {void}
	 */
	addResizeListener() {
		const resizeObserver = new ResizeObserver(entries => {
			const oldCanvasSize = { x: this.canvas.width, y: this.canvas.height };
			const newCanvasSize = { x: this.canvas.clientWidth, y: this.canvas.clientHeight };

			this.canvas.width = newCanvasSize.x;
			this.canvas.height = newCanvasSize.y;

			const newViewportSize = {
				x: (this.size.x * newCanvasSize.x) / oldCanvasSize.x,
				y: (this.size.y * newCanvasSize.y) / oldCanvasSize.y,
			};

			this.setSize(newViewportSize);
		});

		resizeObserver.observe(this.canvas);
	}

	/**
	 * Adds a listener to the viewport to move the viewport when the mouse is dragged
	 * @returns {void}
	 */
	addDragListener() {
		this.canvas.classList.add('draggable');

		let mouseDown = false;
		let lastMousePosition = undefined;

		this.addListener('mousedown', event => {
			mouseDown = true;
			lastMousePosition = { x: event.clientX, y: event.clientY };

			this.canvas.classList.add('dragging');
		});

		this.addListener('mouseup', () => {
			mouseDown = false;
			lastMousePosition = undefined;

			this.canvas.classList.remove('dragging');
		});

		this.addListener('mousemove', event => {
			if (!mouseDown) return;

			const mousePosition = { x: event.clientX, y: event.clientY };
			const delta = {
				x: lastMousePosition.x - mousePosition.x,
				y: lastMousePosition.y - mousePosition.y,
			};

			const worldDelta = this.getWorldDelta(delta);
			this.move(worldDelta);

			lastMousePosition = mousePosition;
		});

		this.addListener('mouseenter', () => {
			mouseDown = false;
			lastMousePosition = undefined;
		});
	}

	/**
	 * Adds a listener to the viewport to zoom the viewport when the mouse wheel is scrolled
	 * @returns {void}
	 */
	addZoomListener() {
		let isHovered = false;
		let lastMousePosition = undefined;

		this.addListener('mouseenter', () => isHovered = true);
		this.addListener('mouseleave', () => isHovered = false);

		this.addListener('mousemove', event => {
			lastMousePosition = { x: event.clientX, y: event.clientY };
		});

		this.addListener('wheel', event => {
			if (!isHovered) return;

			// Zoom in/out at the mouse position
			const mousePosition = lastMousePosition;
			const worldMousePosition = this.getWorldPosition(mousePosition);
			
			const zoomFactor = 1 + (event.deltaY / 1000);
			this.scale(zoomFactor);

			const newWorldMousePosition = this.getWorldPosition(mousePosition);
			const delta = {
				x: worldMousePosition.x - newWorldMousePosition.x,
				y: worldMousePosition.y - newWorldMousePosition.y,
			};

			this.move(delta);
		});
	}


}

export default Viewport;


class ViewportError extends Error {
	constructor(message) {
		super(message);
		this.name = "ViewportError";
	}
}
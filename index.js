import World from './components/World.js';
import Box from './components/RenderElements/Box.js';
import Circle from './components/RenderElements/Circle.js';

const world = new World();
const viewport = world.createViewport("#canvas");
const viewport2 = world.createViewport("#canvas2");

const circle_element = new Circle({ x: 100, y: 100 }, 50, 'yellow');

function init() {
	const red_box = new Box({ x: 0, y: 0 }, { x: 100, y: 100 }, 'red');
	const green_box = new Box({ x: 100, y: 100 }, { x: 100, y: 100 }, 'green');
	const blue_box = new Box({ x: 800, y: 200 }, { x: 100, y: 100 }, 'blue');

	world.add(red_box);
	world.add(green_box);
	world.add(blue_box);

	world.add(circle_element);

	viewport.start(60);
	viewport2.start(60);

	setInterval(update, 1000 / 60);
}

/**
 * Linear interpolation: it returns a value between a and b based on t
 * @param {number} a Start value
 * @param {number} b End value
 * @param {number} t Interpolation value (0-1) It represents the percentage of the interpolation
 */
function lerp(a, b, t) {
	return a + (b - a) * t;
}

function update() {
	const startPosition = circle_element.getPosition();
	const objectivePosition = viewport.getWorldPosition(mousePosition);

	const delta = {
		x: lerp(startPosition.x, objectivePosition.x, 0.25),
		y: lerp(startPosition.y, objectivePosition.y, 0.1),
	};

	circle_element.setPosition(delta);

	// Update the viewport2 position to follow the circle
	viewport2.setPosition({
		x: circle_element.getPosition().x - viewport2.size.x / 2,
		y: circle_element.getPosition().y - viewport2.size.y / 2,
	});
}

document.addEventListener("DOMContentLoaded", init, false);


// Handle mouse inputs

const mousePosition = { x: 0, y: 0 };
var mouseIsClicked = false;

function handleOnClick(e) {
	mouseIsClicked = true;
	canvas.classList.add('active');
}

function handleOnRelease(e) {
	mouseIsClicked = false;
	canvas.classList.remove('active');
}

function handleOnMove(e) {
	mousePosition.x = e.clientX;
	mousePosition.y = e.clientY;

	if (mouseIsClicked) {
		const delta = { x: -e.movementX, y: -e.movementY };
		const viewportDelta = viewport.getWorldDelta(delta);
		viewport.move(viewportDelta);
	}
}

function handleScroll(e) {
	const delta = e.deltaY;
	viewport.scale({ x: 1 + delta / 1000, y: 1 + delta / 1000 });
}

document.addEventListener("mousedown", handleOnClick, false);
document.addEventListener("mouseup", handleOnRelease, false);
document.addEventListener("mousemove", handleOnMove, false);
document.addEventListener("wheel", handleScroll, false);
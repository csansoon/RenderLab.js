import World from './components/World.js';
import Box from './components/RenderElements/Box.js';
import Circle from './components/RenderElements/Circle.js';

const canvas = document.getElementById('canvas');
const world = new World();
const viewport = world.getViewport({ x: 0, y: 0 }, { x: window.innerWidth, y: window.innerHeight }, canvas);

const circle_element = new Circle({ x: 400, y: 400 }, 100, 'rgba(0, 0, 0, 0.5)');

function init() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const red_box = new Box({ x: 0, y: 0 }, { x: 100, y: 100 }, 'red');
	const green_box = new Box({ x: 100, y: 100 }, { x: 100, y: 100 }, 'green');
	const blue_box = new Box({ x: 800, y: 200 }, { x: 100, y: 100 }, 'blue');

	world.add(red_box);
	world.add(green_box);
	world.add(blue_box);

	world.add(circle_element);

	viewport.start(60);

	setInterval(update, 1000 / 60);
}

function resizeCanvas() {
	const oldCanvasSize = { x: canvas.width, y: canvas.height }
	const newCanvasSize = { x: window.innerWidth, y: window.innerHeight };
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const newViewportSize = {
		x: viewport.size.x * newCanvasSize.x / oldCanvasSize.x,
		y: viewport.size.y * newCanvasSize.y / oldCanvasSize.y
	};

	viewport.setSize(newViewportSize);
}

function update() {
	const startPosition = circle_element.getPosition();
	const objectivePosition = viewport.getWorldPosition(mousePosition);

	// speeds up if it is further away from the objective
	const distance = Math.sqrt(Math.pow(objectivePosition.x - startPosition.x, 2) + Math.pow(objectivePosition.y - startPosition.y, 2));
	const speed = Math.min(0.1 + distance / 1000, 1);

	const delta = {
		x: (objectivePosition.x - startPosition.x) * speed,
		y: (objectivePosition.y - startPosition.y) * speed,
	};

	circle_element.move(delta);
}

window.addEventListener("resize", resizeCanvas, false);
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
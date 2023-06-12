import World from './components/World.js';
import Box from './components/RenderElements/Box.js';

const canvas = document.getElementById('canvas');
const world = new World();
const viewport = world.getViewport({ x: 0, y: 0 }, { x: window.innerWidth, y: window.innerHeight }, canvas);

function init() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	const red_box = new Box({ x: 0, y: 0 }, { x: 100, y: 100 }, 'red');
	const green_box = new Box({ x: 100, y: 100 }, { x: 100, y: 100 }, 'green');
	const blue_box = new Box({ x: 800, y: 200 }, { x: 100, y: 100 }, 'blue');

	world.add(red_box);
	world.add(green_box);
	world.add(blue_box);

	viewport.render();
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

window.addEventListener("resize", resizeCanvas, false);
document.addEventListener("DOMContentLoaded", init, false);


// Handle mouse inputs

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
import World from './components/World.js';
import { Box, Circle, Square } from './components/RenderElements.js';


/* ---------------------------- Create the world ---------------------------- */

const world = new World();


/* -------------------- Populate the world with elements -------------------- */

world.add(new Box({
	position: { x: 0, y: 0 },
	size: { x: 100, y: 100 },
	color: "red",
}));

world.add(new Box({
	position: { x: 100, y: 100 },
	size: { x: 100, y: 100 },
	color: 'green',
}));

world.add(new Square({
	position: { x: 800, y: 200 },
	size: { x: 100, y: 100 },
	thickness: 8,
	color: "blue",
}));

const circle_element = world.add(new Circle({
	position: { x: 100, y: 100 },
	radius: 50,
	color: 'yellow',
}));


/* ------------------ Create virtual cameras for the world ------------------ */

const viewport = world.createViewport({ element: "#canvas" });
const viewport2 = world.createViewport({
	element: "#canvas2",
	options: {
		moveOnDrag: false,
		zoomOnScroll: false,
	}
});

viewport.start(60);
viewport2.start(60);


/* ------------------------ Add behavior to the world ----------------------- */

function update() {
	// Move the circle towards the mouse
	const mousePositionInTheWorld = viewport.getWorldPosition(mousePosition);
	circle_element.lerpTo(mousePositionInTheWorld, 0.1);

	// Update the viewport2 position to follow the circle
	viewport2.setPosition({
		x: circle_element.getPosition().x - viewport2.size.x / 2,
		y: circle_element.getPosition().y - viewport2.size.y / 2,
	});
}

// Run the update function 60 times per second
setInterval(update, 1000 / 60);

// Keep track of the mouse position
const mousePosition = { x: 0, y: 0 };
function updateMousePosition(e) {
	mousePosition.x = e.clientX;
	mousePosition.y = e.clientY;
}
document.addEventListener("mousemove", updateMousePosition);
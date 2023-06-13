import World from './components/World.js';
import Box from './components/RenderElements/Box.js';
import Circle from './components/RenderElements/Circle.js';


/* ---------------------------- Create the world ---------------------------- */

const world = new World();


/* -------------------- Populate the world with elements -------------------- */

world.add(new Box({ x: 0, y: 0 }, { x: 100, y: 100 }, 'red'));
world.add(new Box({ x: 100, y: 100 }, { x: 100, y: 100 }, 'green'));
world.add(new Box({ x: 800, y: 200 }, { x: 100, y: 100 }, 'blue'));

const circle_element = new Circle({ x: 100, y: 100 }, 50, 'yellow');
world.add(circle_element);


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
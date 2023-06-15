import World from "/src/components/World.js";
import CellularAutomata from "./custom_components/CellularAutomata.js";

const world = new World();

const viewport = world.createViewport({ element: "#canvas" });
viewport.start(60);

// when document is ready
setTimeout(() => {
	const automata = new CellularAutomata({
		world,
		width: Math.floor(viewport.size.x / 8),
		height: Math.floor(viewport.size.y / 8),
		cell_size: 8,
	});

	setInterval(() => {
		automata.update();
	}, 1000 / 10);
}, 0);
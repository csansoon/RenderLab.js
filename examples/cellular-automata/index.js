import World from "/src/components/World.js";
import CellularAutomata from "./custom_components/CellularAutomata.js";

const world = new World();

const viewport = world.createViewport({ element: "#canvas" });
viewport.start(60);

const automata = new CellularAutomata({
	world,
	width: 200,
	height: 200,
	cell_size: 50,
});

setInterval(() => {
	automata.update();
}, 1000 / 10);
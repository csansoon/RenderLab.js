import World from "/src/components/World.js";
import CellularAutomata from "./custom_components/CellularAutomata.js";

const world = new World();

const viewport = world.createViewport({ element: "#canvas" });
viewport.start(60);

// Simulation variables
var is_playing = true;
var updates_per_second = 10;

// Create a cellular automata with window size
const automata = new CellularAutomata({
	world,
	width: Math.floor(window.innerWidth / 8),
	height: Math.floor(window.innerHeight / 8),
	cell_size: 8,
});

// Update the automata
function update_automata() {
	const update_time = 1000 / updates_per_second;
	const start_time = performance.now();
	if (is_playing) automata.update();
	const end_time = performance.now();
	const elapsed_time = end_time - start_time;

	setTimeout(update_automata, update_time - elapsed_time);
}

update_automata();

// Pause/resume the simulation when the spacebar is pressed
document.addEventListener("keydown", (e) => {
	if (e.code === "Space") is_playing = !is_playing;
});
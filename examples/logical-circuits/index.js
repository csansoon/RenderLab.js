import Circuit from "./custom_components/Circuit.js";
import CircuitComponent from "./custom_components/CircuitComponent.js";

import Battery from "./custom_components/circuit_components/Battery.js";

const circuit = new Circuit();
const viewport = circuit.createViewport("#canvas" );
viewport.start(60);

const component1 = circuit.add(new CircuitComponent({
	position: { x: 600, y: 200 },
	color: "#2b223b",
	num_inputs: 2,
	num_outputs: 1,
	width: 100,
}));

const component2 = circuit.add(new CircuitComponent({
	position: { x: 800, y: 100 },
	color: "#2b223b",
	num_inputs: 1,
	num_outputs: 1,
	width: 100,
}));

const battery = circuit.add(new Battery({
	position: { x: 400, y: 100 },
	color: "#294227",
	num_outputs: 1,
	width: 100,
	value: 1,
}));

circuit.connect(battery, 0, component1, 0);
circuit.connect(component1, 0, component2, 0);

setInterval(() => {
	battery.setValue((Math.sin(Date.now() / 1000) + 1) / 2);
}, 1000 / 60);
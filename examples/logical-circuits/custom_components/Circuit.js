import World from "/src/components/World.js";
import Connection from "./Connection.js";


class Circuit {

	constructor() {
		this.world = new World();
		this.components = [];
		this.connections = [];
	}


	createViewport(element) {
		return this.world.createViewport({ element: element });
	}


	add(component) {
		this.components.push(component);
		this.world.add(component.getRenderElement());
		return component;
	}


	/**
	 * Connects two components together
	 * @param {CircuitComponent} component1
	 * @param {number} output_index
	 * @param {CircuitComponent} component2
	 * @param {number} input_index
	 */
	connect(component1, output_index, component2, input_index) {
		// check that component1 and component2 are in the circuit
		if (!this.components.includes(component1)) {
			console.error("Component 1 is not in the circuit");
			return;
		}
		if (!this.components.includes(component2)) {
			console.error("Component 2 is not in the circuit");
			return;
		}

		if (output_index < 0 || output_index >= component1.getOutputs().length) {
			console.error(`Output index ${output_index} is out of bounds`);
			return;
		}

		if (input_index < 0 || input_index >= component2.getInputs().length) {
			console.error(`Input index ${input_index} is out of bounds`);
			return;
		}

		// check that the output is not already connected
		if (component1.getOutputs()[output_index] !== undefined) {
			console.error(`Output ${output_index} of component 1 is already connected`);
			return;
		}

		// check that the input is not already connected
		if (component2.getInputs()[input_index] !== undefined) {
			console.error(`Input ${input_index} of component 2 is already connected`);
			return;
		}

		// Create connection
		const connection = new Connection({
			input_component: component1,
			input_index: output_index,
			output_component: component2,
			output_index: input_index,
			state: 0,
		});

		// Add connection to components
		component1.getOutputs()[output_index] = connection;
		component2.getInputs()[input_index] = connection;

		// Add connection to circuit
		this.connections.push(connection);
		this.world.add(connection.getRenderElement());


	}
}

export default Circuit;
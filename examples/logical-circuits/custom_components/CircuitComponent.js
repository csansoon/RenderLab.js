import RenderElement from "../../../src/components/RenderElement.js";
import DefaultComponent from "./render_elements/DefaultComponent.js";

const INPUT_GAP = 24;

class CircuitComponent {

	constructor({
		position = { x: 0, y: 0 },
		color = "#2b223b",
		num_inputs = 1,
		num_outputs = 1,
		width = 100, // height is calculated based on the number of inputs and outputs
	}) {
		this.position = position;
		this.color = color;
		this.width = width;

		this.inputs = []; // Array of connections
		this.outputs = []; // Array of connections
		
		for (let i = 0; i < num_inputs; i++) this.inputs.push(undefined);
		for (let i = 0; i < num_outputs; i++) this.outputs.push(undefined);

		this.render_element = new DefaultComponent({
			position,
			color,
			num_inputs,
			num_outputs,
			width,
		});
	}

	/* ---------------------------------- Logic --------------------------------- */

	update() {
		let max_state = 0;
		for (let i = 0; i < this.inputs.length; i++) {
			if (this.inputs[i] !== undefined) {
				max_state = Math.max(max_state, this.inputs[i].state);
			}
		}
		for (let i = 0; i < this.outputs.length; i++) {
			if (this.outputs[i] !== undefined) {
				this.outputs[i].setState(max_state);
			}
		}
	}


	/* -------------------------------- Get data -------------------------------- */

	getPosition() {
		return this.position;
	}

	getColor() {
		return this.color;
	}

	getInputs() {
		return this.inputs;
	}

	getOutputs() {
		return this.outputs;
	}

	getInput(index) {
		if (index < 0 || index >= this.inputs.length) {
			console.error(`Input index ${index} is out of bounds`);
			return undefined;
		}
		return this.inputs[index];
	}

	getOutput(index) {
		if (index < 0 || index >= this.outputs.length) {
			console.error(`Output index ${index} is out of bounds`);
			return undefined;
		}
		return this.outputs[index];
	}

	getInputPosition(index) {
		return {
			x: this.position.x,
			y: this.position.y + (index + 1 * INPUT_GAP),
		};
	}

	getOutputPosition(index) {
		return {
			x: this.position.x + this.width,
			y: this.position.y + (index + 1) * INPUT_GAP,
		};
	}

	getRenderElement() {
		return this.render_element;
	}


}

export default CircuitComponent;
import CircuitComponent from "../CircuitComponent.js";

class Battery extends CircuitComponent {

	constructor({
		position = { x: 0, y: 0 },
		color = "#2b223b",
		num_outputs = 1,
		width = 100, // height is calculated based on the number of inputs and outputs
		value = 0,
	}) {
		super({
			position,
			color,
			num_inputs: 0,
			num_outputs,
			width,
		});

		this.value = value;
	}

	setValue(value) {
		this.value = value;
		for (let i = 0; i < this.outputs.length; i++) {
			if (this.outputs[i] !== undefined) {
				this.outputs[i].setState(this.value);
			}
		}
	}

	update() {
		for (let i = 0; i < this.outputs.length; i++) {
			if (this.outputs[i] !== undefined) {
				this.outputs[i].setState(this.value);
			}
		}
	}
	
}

export default Battery;
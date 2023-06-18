import Wire from "./render_elements/Wire.js";


const OFF_COLOR = "#4f4561";
const ON_COLOR = "#29bbff";

class Connection {

	constructor({
		input_component,
		input_index,
		output_component,
		output_index,
		state = 0, // value from 0 to 1
	}) {
		this.input_component = input_component;
		this.input_index = input_index;
		this.output_component = output_component;
		this.output_index = output_index;

		this.state = Math.min(1, Math.max(0, state));

		const from_position = this.input_component.getOutputPosition(this.input_index);
		const to_position = this.output_component.getInputPosition(this.output_index);

		// if the input and output positions are on different y coordinates, then add a bend in the wire so it has always 90 degree angles
		const path = [];
		if (from_position.y !== to_position.y) {
			const bend_position = (from_position.x + to_position.x) / 2;
			path.push({ x: bend_position, y: from_position.y });
			path.push({ x: bend_position, y: to_position.y });
		}


		this.render_element = new Wire({
			from: this.input_component.getOutputPosition(this.input_index),
			to: this.output_component.getInputPosition(this.output_index),
			path: path,
			color: this.getColor(),
			glow: this.state,
		});
	}

	getColor() {
		// color ranging from OFF_COLOR to ON_COLOR based on state
		let r = Math.round((1 - this.state) * parseInt(OFF_COLOR.slice(1, 3), 16) + this.state * parseInt(ON_COLOR.slice(1, 3), 16));
		let g = Math.round((1 - this.state) * parseInt(OFF_COLOR.slice(3, 5), 16) + this.state * parseInt(ON_COLOR.slice(3, 5), 16));
		let b = Math.round((1 - this.state) * parseInt(OFF_COLOR.slice(5, 7), 16) + this.state * parseInt(ON_COLOR.slice(5, 7), 16));
		return "#" + r.toString(16) + g.toString(16) + b.toString(16);
	}


	setState(state) {
		state = Math.min(1, Math.max(0, state));
		if (state === this.state) return;

		this.state = state;
		
		this.render_element.color = this.getColor();
		this.render_element.glow = state;

		if (this.output_component) {
			this.output_component.update();
		}
	}


	getRenderElement() {
		return this.render_element;
	}


}

export default Connection;
import RenderElement from "../RenderElement.js";

class Circle extends RenderElement {

	constructor(position, radius, color) {
		super(position);
		this.radius = radius;
		this.color = color;
	}

	getPosition() {
		return this.position;
	}

	getBoundingBox() {
		return {
			left: this.position.x - this.radius,
			top: this.position.y - this.radius,
			right: this.position.x + this.radius,
			bottom: this.position.y + this.radius,
		};
	}

	render(ctx, offset, scale) {
		const x = (this.position.x + offset.x) * scale.x;
		const y = (this.position.y + offset.y) * scale.y;
		const radius = this.radius * scale.x;

		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fill();
	}
}

export default Circle;
import RenderElement from "../RenderElement.js";

class Box extends RenderElement {

	constructor(position, size, color) {
		super(position);
		this.size = size;
		this.color = color;
	}

	getBoundingBox() {
		return {
			left: this.position.x,
			top: this.position.y,
			right: this.position.x + this.size.x,
			bottom: this.position.y + this.size.y
		};
	}

	render(ctx, offset, scale) {
		const x = (this.position.x + offset.x) * scale.x;
		const y = (this.position.y + offset.y) * scale.y;
		const width = this.size.x * scale.x;
		const height = this.size.y * scale.y;

		ctx.fillStyle = this.color;
		ctx.fillRect(x, y, width, height);
	}
}

export default Box;
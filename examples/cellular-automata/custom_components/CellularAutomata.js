import { Box } from "/src/components/RenderElements.js";

class CellularAutomata {

	constructor({
		world,
		position = { x: 0, y: 0 },
		width = 100,
		height = 100,
		cell_size = 5,
	}) {
		this.position = position;

		this.width = width;
		this.height = height;

		this.cell_size = cell_size;
		this.cell_color = ["white", "#28233a"];

		this.elements = new Array(width);
		this.grid = new Array(width);
		for (let i = 0; i < width; i++) {
			this.grid[i] = new Array(height);
			this.elements[i] = new Array(height);
			
			for (let j = 0; j < height; j++) {
				const value = Math.random() < 0.5 ? 1 : 0;

				this.grid[i][j] = value;
				this.elements[i][j] = new Box({
					position: {
						x: this.position.x + i * this.cell_size,
						y: this.position.y + j * this.cell_size,
					},
					size: {
						x: this.cell_size + 1,
						y: this.cell_size + 1,
					},
					color: this.cell_color[value % this.cell_color.length],
				});
				world.add(this.elements[i][j]);
			}
		}
	}


	/**
	 * Updates the cellular automata
	 * @returns {void}
	 */
	update() {
		const new_grid = new Array(this.width);
		for (let i = 0; i < this.width; i++) new_grid[i] = new Array(this.height);

		// calculate new states
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				new_grid[x][y] = this.getNewState(x, y, this.grid);
			}
		}

		// update grid and elements
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.grid[x][y] = new_grid[x][y];
				this.elements[x][y].setColor(this.cell_color[this.grid[x][y] % this.cell_color.length]);
			}
		}
	}

	/**
	 * Returns the new state of a cell
	 * @param {number} x X position of the cell
	 * @param {number} y Y position of the cell
	 * @param {Array<Array<int>>} grid Grid of the cellular automata
	 * @returns {number} New state of the cell
	 */
	getNewState(x, y, grid) {
		// cableworld rules
		const neighbors = this.getNeighbors(x, y, grid);
		const alive_neighbors = neighbors.filter(n => n === 1).length;
		if (grid[x][y] === 1) {
			if (alive_neighbors === 2 || alive_neighbors === 3) return 1;
			else return 0;
		}
		else {
			if (alive_neighbors === 3) return 1;
			else return 0;
		}
	}

	/**
	 * Returns the neighbors of a cell
	 * @param {number} x X position of the cell
	 * @param {number} y Y position of the cell
	 * @param {Array<Array<int>>} grid Grid of the cellular automata
	 * @returns {Array<number>} Neighbors of the cell
	 */
	getNeighbors(x, y, grid) {
		const neighbors = [];
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				const nx = x + dx;
				const ny = y + dy;
				if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
					if (dx !== 0 || dy !== 0) neighbors.push(grid[nx][ny]);
				}
			}
		}
		return neighbors;
	}
}

export default CellularAutomata;
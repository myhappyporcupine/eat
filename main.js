function randInt(limit) {
	return Math.floor(Math.random() * limit);
}

function randItem(array) {
	return array[randInt(array.length)];
}

function randPop(array) {
	return array.splice(randInt(array.length), 1)[0];
}

function createTable(world) {
	let colors = colorize(world);
	let table = document.createElement("table");
	table.style.padding = "20px";
	table.style.cssFloat = "left";
		for (let y = 0; y < world.height; y++) {
			let tr = document.createElement("tr");
			for (let x = 0; x < world.width; x++) {
				let td = document.createElement("td");
				td.style.width = "10px";
				td.style.height = "10px";
				td.style.border = "1px solid #aaa";
				td.style.backgroundColor = colors[x + y * world.width];
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		return table;
}

function colorize(world) {
	return world.grid.map(cell => {
		switch (cell) {
			case "empty":
				return "white";
				break;
			case "plant":
				return "lightgreen";
				break;
			case "herbivore":
				return "dodgerblue";
				break;
			case "carnivore":
				return "crimson";
				break;
			default:
				return "gray";
				break;
		}
	});
}

function neighborhood(creature) {
	let neighbors = {
		all: [],
		empty: [],
		plant: [],
		herbivore: [],
		carnivore: []
	};
	for (let y = creature.y - 1; y <= creature.y + 1; y++)
		for (let x = creature.x - 1; x <= creature.x + 1; x++)
			if (x >= 0 && x < world.width &&
				y >= 0 && y < world.height &&
				!(x == creature.x && y == creature.y))
				neighbors.all.push({x, y, value: world.grid[x + y * world.width]});
	for (let neighbor of neighbors.all)
		switch (neighbor.value) {
			case "empty":
				neighbors.empty.push(neighbor);
				break;
			case "plant":
				neighbors.plant.push(neighbor);
				break;
			case "herbivore":
				neighbors.herbivore.push(neighbor);
				break;
			case "carnivore":
				neighbors.carnivore.push(neighbor);
				break;
			default:
				break;
		}
	return neighbors;
}

let world = {
	width: 40,
	height: 20,
}
world.grid = new Array(world.width * world.height).fill().map(cell => {
	let r = Math.random();
	if (r < 0.5) return "empty";
	else if (r < 0.75) return "plant";
	else if (r < 0.95) return "herbivore";
	else return "carnivore";

});

function doPlant() {
	let emptyCells = [];
	for (let y = 0; y < world.height; y++)
		for (let x = 0; x < world.width; x++)
			if (world.grid[x + y * world.width] == "empty")
				emptyCells.push({x, y});
	let target = randItem(emptyCells);
	if (target)
		world.grid[target.x + target.y * world.width] = "plant";
}

function doHerbivore(herbivore) {
	let neighbors = neighborhood(herbivore);
	if (neighbors.plant.length) {
		let target = randItem(neighbors.plant);
		world.grid[herbivore.x + herbivore.y * world.width] = "empty";
		world.grid[target.x + target.y * world.width] = "herbivore";
		// birth
		if (Math.random() < 0.5) {
			neighbors = neighborhood(target);
			if (neighbors.empty.length) {
				target = randItem(neighbors.empty);
				world.grid[target.x + target.y * world.width] = "herbivore";
			}
		}
	} else if (neighbors.empty.length) {
		let target = randItem(neighbors.empty);
		world.grid[herbivore.x + herbivore.y * world.width] = "empty";
		world.grid[target.x + target.y * world.width] = "herbivore";
	}
}

function doCarnivore(carnivore) {
	let neighbors = neighborhood(carnivore);
	if (neighbors.herbivore.length) {
		let target = randItem(neighbors.herbivore);
		world.grid[carnivore.x + carnivore.y * world.width] = "empty";
		world.grid[target.x + target.y * world.width] = "carnivore";
		// birth
		if (Math.random() < 0.5) {
			neighbors = neighborhood(target);
			if (neighbors.empty.length) {
				target = randItem(neighbors.empty);
				world.grid[target.x + target.y * world.width] = "carnivore";
			}
		}
	} else if (neighbors.carnivore.length) {
		let target = randItem(neighbors.carnivore);
		world.grid[carnivore.x + carnivore.y * world.width] = "empty";
		world.grid[target.x + target.y * world.width] = "carnivore";
		// birth
		if (Math.random() < 0.5) {
			neighbors = neighborhood(target);
			if (neighbors.empty.length) {
				target = randItem(neighbors.empty);
				world.grid[target.x + target.y * world.width] = "plant";
			}
		}
	} else if (neighbors.empty.length) {
		let target = randItem(neighbors.empty);
		world.grid[carnivore.x + carnivore.y * world.width] = "empty";
		world.grid[target.x + target.y * world.width] = "carnivore";
	}
}

let herbivores = [];
let carnivores = [];
let stage = "init";
function step() {
	switch (stage) {
		case "init":
			for (let y = 0; y < world.height; y++)
				for (let x = 0; x < world.width; x++)
					switch(world.grid[x + y * world.width]) {
						case "herbivore":
							herbivores.push({x, y});
							break;
						case "carnivore":
							carnivores.push({x, y});
							break;
						default:
							break;
					}
			stage = "plants";
			break;
		case "plants":
			doPlant();
			stage = "afterplants";
			break;
		case "afterplants":
			stage = "herbivores";
			break;
		case "herbivores":
			let herbivore = randPop(herbivores);
			if (herbivore)
				doHerbivore(herbivore);
			else
				stage = "carnivores";
			break;
		case "carnivores":
			let carnivore = randPop(carnivores);
			if (carnivore)
				doCarnivore(carnivore);
			else
				stage = "init"
			break;
	}
}

let table = createTable(world);
document.body.appendChild(table);
function frame() {
	requestAnimationFrame(frame);
	step();
	table.remove();
	table = createTable(world);
	document.body.appendChild(table);
}
frame();
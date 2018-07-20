var Tile = require("./Tile");

class Field {

	constructor (area) {

		this.id = { type: "field", "no": area.id.no };

		this.area = area;
		this.tiles = [];
		for (var i = 0; i < 9; i++)
			this.tiles.push(new Tile(i, this));
	}

	get front () {

		return this.tiles.slice(0, 4);
	}

	get back () {

		return this.tiles.slice(4, 9);
	}

	get opposite () {

		return this.area.opposite.field;
	}
}

module.exports = Field;
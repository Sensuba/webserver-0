var Types = require("./Types");

class Area {

	constructor (basis) {

	}

	compute (ctx) {

		return ctx.gameboard.areas[ctx.player].field.tiles;
	}
}

module.exports = Area;
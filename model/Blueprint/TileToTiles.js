var Bloc = require('./Bloc');
var Types = require('./Types');

class TileToTiles extends Bloc {

	constructor (src, ctx) {

		super("tiletotiles", src, ctx);
		this.f = (src, ins) => [[ins[0]]];
		this.types = [Types.location];
	}
}

module.exports = TileToTiles;
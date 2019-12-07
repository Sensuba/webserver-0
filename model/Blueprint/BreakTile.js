var Bloc = require('./Bloc');
var Types = require('./Types');

class BreakTile extends Bloc {

	constructor (src, ctx) {

		super("brktile", src, ctx);
		this.f = (src, ins) => ins[0].neighbors ?
			[ins[0].field.tiles, ins[0].area, ins[0].inFront, ins[0].isEmpty, ins[0].card, ins[0].neighbors, ins[0].adjacents, ins[0].tilesAhead, ins[0].tilesBehind, ins[0].line, ins[0].left, ins[0].right, ins[0].mirror] :
			[[], ins[0].area, false, false, null [], [], [], [], [], null, null, null];
		this.types = [Types.location];
	}
}

module.exports = BreakTile;
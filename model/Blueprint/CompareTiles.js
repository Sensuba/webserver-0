var Bloc = require('./Bloc');
var Types = require('./Types');

class CompareTiles extends Bloc {

	constructor (src, ctx) {

		super("cmptiles", src, ctx);
		this.f = (src, ins) => ins[0].neighbors && ins[1].neighbors ?
		[ins[0].id === ins[1].id, ins[0].area.id === ins[1].area.id && ins[0].inFront === ins[1].inFront, ins[0].area.id === ins[1].area.id, ins[0].isNeighborTo(ins[1]), ins[0].isAdjacentTo(ins[1]), ins[0].distanceTo(ins[1])] :
		[false, false, false, false, false, -1];
		this.types = [Types.location, Types.location];
	}
}

module.exports = CompareTiles;
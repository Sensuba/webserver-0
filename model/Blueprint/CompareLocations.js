var Bloc = require('./Bloc');
var Types = require('./Types');

class CompareLocations extends Bloc {

	constructor (src, ctx) {

		super("cmplocations", src, ctx);
		this.f = (src, ins) => [ins[0] && ins[1] && ins[0].id === ins[1].id, ins[0] && ins[1] && ins[0].area.id === ins[1].area.id];
		this.types = [Types.location, Types.location];
	}
}

module.exports = CompareLocations;
var Bloc = require('./Bloc');
var Types = require('./Types');

class Archetype extends Bloc {

	constructor (src, ctx) {

		super("archetype", src, ctx);
		this.f = (src, ins) => [card => card.isArchetype(ins[0])];
		this.types = [Types.string];
	}
}

module.exports = Archetype;
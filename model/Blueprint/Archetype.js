var Bloc = require('./Bloc');
var Types = require('./Types');

class Archetype extends Bloc {

	constructor (src, ctx) {

		super("archetype", src, ctx);
		this.f = (src, ins) => [card => card.isArchetype(ins[0]), model => (model.archetypes && model.archetypes.includes(ins[0])) || (ins[0] === "mecha" && model.mecha)];
		this.types = [Types.string];
	}
}

module.exports = Archetype;
var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterHazards extends Bloc {

	constructor (src, ctx) {

		super("filterhazards", src, ctx);
		this.f = (src, ins) => [(src, target) => target.hasHazards(ins[0])];
		this.types = [Types.hazard];
	}
}

module.exports = FilterHazards;
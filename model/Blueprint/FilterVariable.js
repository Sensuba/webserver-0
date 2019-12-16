var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterVariable extends Bloc {

	constructor (src, ctx) {

		super("filtervar", src, ctx);
		this.f = (src, ins) => [target => target && target.getVariable(ins[0]) !== undefined];
		this.types = [Types.string];
	}
}

module.exports = FilterVariable;
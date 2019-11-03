var Bloc = require('./Bloc');
var Types = require('./Types');

class ModelVariable extends Bloc {

	constructor (src, ctx) {

		super("modelvar", src, ctx);
		this.f = (src, ins) => [(ins[1] || src).getVariable(ins[0]), (ins[1] || src).getVariable(ins[0]) !== undefined];
		this.types = [Types.string, Types.card];
	}
}

module.exports = ModelVariable;
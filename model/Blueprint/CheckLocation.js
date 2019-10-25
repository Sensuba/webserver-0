var Bloc = require('./Bloc');
var Types = require('./Types');

class CheckLocation extends Bloc {

	constructor (src, ctx) {

		super("checkloc", src, ctx);
		this.f = (src, ins) => [ins[1].includes(ins[0])];
		this.types = [Types.location, Types.locations];
	}
}

module.exports = CheckLocation;
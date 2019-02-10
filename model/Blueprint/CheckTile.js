var Bloc = require('./Bloc');
var Types = require('./Types');

class CheckTile extends Bloc {

	constructor (src, ctx) {

		super("checktile", src, ctx);
		this.f = (src, ins) => [ins[1](src, ins[0])];
		this.types = [Types.card, Types.tilefilter];
	}
}

module.exports = CheckTile;
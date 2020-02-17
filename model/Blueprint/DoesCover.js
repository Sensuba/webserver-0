var Bloc = require('./Bloc');
var Types = require('./Types');

class DoesCover extends Bloc {

	constructor (src, ctx) {

		super("cover", src, ctx);
		this.f = (src, ins) => {console.log(ins[1]);return[ins[0].cover(ins[1], false) || ins[0].cover(ins[1], true), ins[0].cover(ins[1], false), ins[0].cover(ins[1], true)]};
		this.types = [Types.card, Types.card];
	}
}

module.exports = DoesCover;
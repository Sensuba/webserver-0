var Bloc = require('./Bloc');
var Types = require('./Types');

class TargetData extends Bloc {

	constructor (src, ctx) {

		super("target", src, ctx);
		this.f = (src, ins) => {
			let targetlength = ins[0].isType("figure") ? 1 : 0;
			return [(src, target) => ins[0].targets.length > targetlength && ins[0].targets[targetlength](src, target), ins[0].targets.length > targetlength];
		}
		this.types = [Types.card];
	}
}

module.exports = TargetData;
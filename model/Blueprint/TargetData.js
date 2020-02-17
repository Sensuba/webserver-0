var Bloc = require('./Bloc');
var Types = require('./Types');

class TargetData extends Bloc {

	constructor (src, ctx) {

		super("target", src, ctx);
		this.f = (src, ins) => [(src, target) => ins[0].targets.length > 0 && ins[0].targets[0](src, target), ins[0].targets.length > 0];
		this.types = [Types.card];
	}
}

module.exports = TargetData;
var Bloc = require('./Bloc');
var Types = require('./Types');

class ConditionalTarget extends Bloc {

	constructor (src, ctx) {

		super("conditiontarget", src, ctx);
		this.f = (src, ins) => [(src, target) => ins[0](src, target) && ins[1]];
		this.types = [Types.tilefilter, Types.bool];
	}
}

module.exports = ConditionalTarget;
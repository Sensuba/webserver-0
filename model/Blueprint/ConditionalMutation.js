var Bloc = require('./Bloc');
var Types = require('./Types');

class ConditionalMutation extends Bloc {

	constructor (src, ctx) {

		super("conditionmut", src, ctx);
		this.f = (src, ins, image) => [(x => this.computeIn(image)[1] ? ins[0](x) : x)];
		this.types = [Types.mutation, Types.bool];
	}
}

module.exports = ConditionalMutation;
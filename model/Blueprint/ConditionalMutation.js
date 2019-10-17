var Bloc = require('./Bloc');
var Types = require('./Types');

class ConditionalMutation extends Bloc {

	constructor (src, ctx) {

		super("conditionmut", src, ctx);
		this.f = (src, ins, image) => [(x => this.in[1](image, x) ? ins[0](x) : x)];
		this.types = [Types.mutation, Types.bool];
	}

	execute (src, data) {
		
		var f = this.f || (() => []);
		var mut = this.in[0](src, data);
		this.out = f(this.src, [mut], src, data);
		if (this.to)
			this.to.execute(src);
	}
}

module.exports = ConditionalMutation;
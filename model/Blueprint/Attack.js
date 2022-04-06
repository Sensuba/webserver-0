var Bloc = require('./Bloc');
var Types = require('./Types');
var Mutation = require("../Mutation");

class Attack extends Bloc {

	constructor (src, ctx) {

		super("attack", src, ctx, true);
		this.f = (src, ins) => {
			if (ins[2]) {
				var mut = new Mutation(ins[2]);
				mut.attach(ins[0]);
				ins[0].update();
				ins[0].attack(ins[1], true);
				mut.detach();
				ins[0].update();
			} else
				ins[0].attack(ins[1], true);
			return [];
		}
		this.types = [Types.card, Types.card, Types.mutation];
	}
}

module.exports = Attack;
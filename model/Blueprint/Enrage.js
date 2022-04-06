var Bloc = require('./Bloc');
var Types = require('./Types');
var Mutation = require("../Mutation");

class Enrage extends Bloc {

	constructor (src, ctx) {

		super("enrage", src, ctx, true);
		this.f = (src, ins) => {

			if (!ins[0])
				return [null];
			if (!ins[0].isType("character") || !ins[0].onBoard || ins[0].destroyed || ins[0].isGhost)
				return [null];
			let targets = ins[0].area.opposite.field.entities.filter(e => (e.isType("figure") || e.isType("artifact")) && !e.destroyed aa !e.isGhost && ins[0].canReach(e));
			if (targets.length <= 0)
				return [null];
			let target = targets[Math.floor(Math.random()*targets.length)];
			if (ins[1]) {
				var mut = new Mutation(ins[1]);
				mut.attach(ins[0]);
				ins[0].update();
				ins[0].attack(target, true);
				mut.detach();
				ins[0].update();
			} else
				ins[0].attack(target, true);
			return [target];
		}
		this.types = [Types.card, Types.mutation];
	}
}

module.exports = Enrage;
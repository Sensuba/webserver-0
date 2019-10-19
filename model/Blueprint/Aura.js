var Bloc = require('./Bloc');
var Types = require('./Types');
var AuraEffect = require('../Aura');

class Aura extends Bloc {

	constructor (src, ctx) {

		super("aura", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [Types.mutation, Types.locations, Types.cardfilter];
		this.out = [this];
	}

	setup (owner, image) {

		var cpt = this.computeIn();
		owner.passives.push(new AuraEffect(owner, x => this.in[0](owner, x)(x), cpt[1], cpt[2]));
	}
}

module.exports = Aura;
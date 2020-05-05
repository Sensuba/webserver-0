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
		owner.passives.push(new AuraEffect(owner, x => this.in[0]({src: owner, data: x})(x), () => this.in[1]({src: owner}), cpt[2] ? cpt[2] : x => true));
	}
}

module.exports = Aura;
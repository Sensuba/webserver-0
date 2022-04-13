var Bloc = require('./Bloc');
var Types = require('./Types');

class PilotMutation extends Bloc {

	constructor (src, ctx) {

		super("pilotmut", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [Types.mutation];
		this.out = [this];
	}

	setup (owner, image) {

		var mut = x => this.in[0]({src: owner, data: x})(x);
		owner.pmutations.push(mut);
		owner.innereffects.push(this);
	}
}

module.exports = PilotMutation;
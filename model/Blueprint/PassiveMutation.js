var Bloc = require('./Bloc');
var Types = require('./Types');
var Mutation = require('../Mutation');

class PassiveMutation extends Bloc {

	constructor (src, ctx) {

		super("passivemut", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [Types.mutation];
		this.out = [this];

		if (!src.mutdata)
			src.mutdata = [];
		src.mutdata.push(this);
		this.mutno = src.mutdata.length-1;
	}

	setup (owner, image) {

		//var cpt = this.computeIn();
		var mut = x => this.in[0]({src: owner, data: x})(x);
		new Mutation(mut, 3).attach(owner);
	}

	getMutation () {

		return {effect: this.in[0]()};
	}
}

module.exports = PassiveMutation;
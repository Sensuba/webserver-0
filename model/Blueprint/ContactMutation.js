var Bloc = require('./Bloc');
var Types = require('./Types');

class ContactMutation extends Bloc {

	constructor (src, ctx) {

		super("contactmut", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [Types.mutation, Types.cardfilter];
		this.out = [this];
	}

	setup (owner, image) {

		var mut = x => this.in[0](owner, x)(x);
		owner.cmutations.push({effect: mut, targets: this.in[1]()});
	}
}

module.exports = ContactMutation;
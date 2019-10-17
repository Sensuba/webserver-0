var Bloc = require('./Bloc');

class MutationTarget extends Bloc {

	constructor (src, ctx) {

		super("innerdata", src, ctx);
		this.f = (src, ins, image, data) => [data];
		this.types = [];
	}
}

module.exports = MutationTarget;
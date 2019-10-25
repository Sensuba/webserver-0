var Bloc = require('./Bloc');
var Types = require('./Types');

class Transform extends Bloc {

	constructor (src, ctx) {

		super("transform", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].transform(ins[1]);
			return [];
		};
		this.types = [Types.card, Types.model];
	}
}

module.exports = Transform;
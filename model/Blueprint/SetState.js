var Bloc = require('./Bloc');
var Types = require('./Types');

class SetState extends Bloc {

	constructor (src, ctx) {

		super("setstate", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].setState(ins[1], ins[2]);
			return [];
		};
		this.types = [Types.card, Types.state, Types.bool];
	}
}

module.exports = SetState;
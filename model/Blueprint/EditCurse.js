var Bloc = require('./Bloc');
var Types = require('./Types');

class EditCurse extends Bloc {

	constructor (src, ctx) {

		super("editcurse", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].deck.editCurse(ins[1], ins[2]);
			return [];
		};
		this.types = [Types.area, Types.int, Types.int];
	}
}

module.exports = EditCurse;
var Bloc = require('./Bloc');
var Types = require('./Types');

class SetVisibility extends Bloc {

	constructor (src, ctx) {

		super("setvisibility", src, ctx, true);
		this.f = (src, ins) => {
			ins[0].public = ins[1];
			ins[0].area.gameboard.notify("visibilityloc", ins[0], {type: "bool", value: ins[1]});
			if (ins[1])
				ins[0].cards.forEach(card => card.reveal());
			return [];
		};
		this.types = [Types.location, Types.bool];
	}
}

module.exports = SetVisibility;
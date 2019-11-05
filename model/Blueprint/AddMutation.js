var Bloc = require('./Bloc');
var Types = require('./Types');

class AddMutation extends Bloc {

	constructor (src, ctx) {

		super("addmut", src, ctx, true);
		this.f = (src, ins) => {

			ins[0].mutate(ins[1], ins[2]);
			src.gameboard.notify("addmut", ins[0], src, {type: "int", value: this.mutno});

			return [];
		};
		this.types = [Types.card, Types.mutation, Types.event];

		if (!src.mutdata)
			src.mutdata = [];
		src.mutdata.push(this);
		this.mutno = src.mutdata.length-1;
	}

	getMutation () {

		return {effect: this.in[1](), end: this.in[2]()};
	}
}

module.exports = AddMutation;
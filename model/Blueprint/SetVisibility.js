var Bloc = require('./Bloc');
var Types = require('./Types');

class SetVisibility extends Bloc {

	constructor (src, ctx) {

		super("setvisibility", src, ctx, true);
		this.f = (src, ins) => {
			let reveal = !ins[0].public && ins[1] === "public", privatereveal = !ins[0].private && ins[1] === "private";
			ins[0].public = ins[1] === "public";
			ins[0].private = ins[1] === "private";
			ins[0].area.gameboard.notify("visibilityloc", ins[0], {type: "string", value: ins[1]});
			if (reveal)
				ins[0].cards.forEach(card => card.reveal());
			if (privatereveal && ins[0].id.type === "deck" && !ins[0].isEmpty)
				ins[0].area.gameboard.notify("topdeck", ins[0], ins[0].firstCard);
			return [];
		};
		this.types = [Types.location, Types.visibility];
	}
}

module.exports = SetVisibility;
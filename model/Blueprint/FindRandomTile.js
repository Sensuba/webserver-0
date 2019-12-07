var Bloc = require('./Bloc');
var Types = require('./Types');

class FindRandomTile extends Bloc {

	constructor (src, ctx) {

		super("findtile", src, ctx);
		this.f = (src, ins) => {
			var items = ins[0].filter(tile => ins[1](tile));
			var item = items.length > 0 ? items[Math.floor(Math.random()*items.length)] : null;
			return [item, item !== null];
		};
		this.types = [Types.locations, Types.cardfilter];
	}
}

module.exports = FindRandomTile;
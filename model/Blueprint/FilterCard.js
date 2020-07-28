var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterCard extends Bloc {

	constructor (src, ctx) {

		super("filtercard", src, ctx);
		this.f = (src, ins) => [
			target => target && target === ins[0],
			target => target !== ins[0],
			target => target && ins[0] && this.compareCards(target, ins[0]),
			target => target && ins[0] && target.idCardmodel === ins[0].idCardmodel
		];
		this.types = [Types.card];
	}

	compareCards (a, b) {

		if (!a.idCardmodel && !b.idCardmodel) {
			if (a.parent && b.parent)
				if (a.notoken === b.notoken)
					return this.compareCards(a.parent, b.parent);
		}
		else if (a.idCardmodel === b.idCardmodel)
			return true;
		return false;
	}
}

module.exports = FilterCard;
var Bloc = require('./Bloc');
var Types = require('./Types');

class Category extends Bloc {

	constructor (src, ctx) {

		super("category", src, ctx);
		this.f = (src, ins) => [card => card.category && card.category === ins[0], model => model.category && model.category === ins[0]];
		this.types = [Types.string];
	}
}

module.exports = Category;
var Bloc = require('./Bloc');
var Types = require('./Types');
var Bank = require("../../Bank");

class FindRandomModel extends Bloc {

	constructor (src, ctx) {

		super("findmodel", src, ctx);
		this.f = (src, ins) => {
			var l = Bank.list();
			var items = Object.keys(l).map(k => l[k]).filter(card => ins[0](card));
			var item = items.length > 0 ? items[Math.floor(Math.random()*items.length)] : null;
			return [item, item !== null];
		};
		this.types = [Types.modelfilter];
	}
}

module.exports = FindRandomModel;
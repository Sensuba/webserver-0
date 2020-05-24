var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterModel extends Bloc {

	constructor (src, ctx) {

		super("filtermodel", src, ctx);
		this.f = (src, ins) => [ target => target && ins[0] && target.idCardmodel === ins[0] ]
		this.types = [Types.model];
	}
}

module.exports = FilterModel;
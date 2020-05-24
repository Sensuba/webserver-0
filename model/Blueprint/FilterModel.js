var Bloc = require('./Bloc');
var Types = require('./Types');

class FilterModel extends Bloc {

	constructor (src, ctx) {

		super("filtermodel", src, ctx);
		this.f = (src, ins) => [ target => target && ins[0] && (target.idCardmodel === ins[0].idCardmodel || (target.parent && ins[0].parent && target.parent.idCardmodel && ins[0].parent.idCardmodel && target.parent.idCardmodel === ins[0].parent.idCardmodel && target.token === ins[0].token)) ]
		this.types = [Types.model];
	}
}

module.exports = FilterModel;
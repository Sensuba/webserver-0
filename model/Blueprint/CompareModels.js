var Bloc = require('./Bloc');
var Types = require('./Types');

class CompareModels extends Bloc {

	constructor (src, ctx) {

		super("cmpmodels", src, ctx);
		let that = this;
		this.f = (src, ins) => [that.compareStep(ins[0], ins[1])];
		this.types = [Types.model, Types.model];
	}

	compareStep (a, b) {

		if (a.parent && b.parent) {
			if (a.notoken !== b.notoken)
				return false;
			return this.compareStep(a.parent, b.parent);
		}
		if (!a.parent && !b.parent)
			return a.idCardmodel === b.idCardmodel;
		return false;
	}
}

module.exports = CompareModels;
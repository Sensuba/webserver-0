var Bloc = require('./Bloc');
var Types = require('./Types');
var Bank = require("../../Bank");

class Token extends Bloc {

	constructor (src, ctx) {

		super("token", src, ctx);
		this.f = (src, ins) => {
			var noModel;
			if (ins[0] === null)
				ins[0] = 0;
			if (ins[0] < 0)
				noModel = src.parent.model;
			else
				noModel = { parent: src.idCardmodel, token: ins[0] };
			return [Bank.get(noModel)];
		};
		this.types = [Types.int];
	}
}

module.exports = Token;
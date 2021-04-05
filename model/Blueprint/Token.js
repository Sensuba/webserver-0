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
			if (ins[0] < 0) {
				noModel = this.src.parent.model || this.src.parent.idCardmodel || this.genParent(this.src.parent);
			}
			else {
				noModel = { parent: this.genParent(this.src), token: ins[0] };
			}
			return [Bank.get(noModel)];
		};
		this.types = [Types.int];
	}

	genParent (src) {

		if (src.idCardmodel)
			return src.idCardmodel > 10000 || src.idCardmodel < 0 ? src : src.idCardmodel;
		else if (src.parent)
			return { parent: this.genParent(src.parent), token: src.parent.tokens.findIndex((token, i) => i === src.notoken) };
		return src;
	}
}

module.exports = Token;
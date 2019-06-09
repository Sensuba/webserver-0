var Bloc = require('./Bloc');
var Types = require('./Types');

class Branch extends Bloc {

	constructor (src, ctx) {

		super("branch", src, ctx, true);
		this.f = (src, ins, image) => {
			var next = ins[0] ? this.true : this.false;
			if (next)
				next.execute(image);
		}
		this.types = [Types.bool];
		this.toPrepare.push("true");
		this.toPrepare.push("false");
	}
}

module.exports = Branch;
var Bloc = require('./Bloc');
var Types = require('./Types');

class Loop extends Bloc {

	constructor (src, ctx) {

		super("loop", src, ctx, true);
		this.f = (src, ins) => {
			this.times = (this.times || ins[0]) - 1;
			if (!ins[1] || this.times < 0) {
				if (this.completed)
					this.completed.execute();
				return;
			}
			var index = ins[0] - this.times + 1;
			this.out = [index];
			if (this.loop)
				this.loop.execute();
			this.execute();
			return [0];
		}
		this.types = [Types.int, Types.bool];
		this.toPrepare.push("loop");
		this.toPrepare.push("completed");
	}
}

module.exports = Loop;
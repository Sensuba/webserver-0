var Bloc = require('./Bloc');
var Types = require('./Types');

class Loop extends Bloc {

	constructor (src, ctx) {

		super("loop", src, ctx, true);
		this.f = (src, ins, props) => {
			var count = ins[0] === "" || ins[0] === null || ins[0] === undefined ? 256 : ins[0];
			this.times = this.times === 0 ? this.times - 1 : (this.times || count) - 1;
			if (!this.in[1]() || this.times < 0) {
				delete this.times;
				if (this.completed)
					this.completed.execute(props);
				return [0];
			}
			var index = ins[0] - this.times - 1;
			this.out = [index];
			if (this.loop)
				this.loop.execute(props);
			this.execute(props);
			return [0];
		}
		this.types = [Types.int, Types.bool];
		this.toPrepare.push("loop");
		this.toPrepare.push("completed");
	}
}

module.exports = Loop;
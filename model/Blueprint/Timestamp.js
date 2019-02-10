var Bloc = require('./Bloc');
var Types = require('./Types');

class Timestamp extends Bloc {

	constructor (src, ctx) {

		super("timestamp", src, ctx);
		this.f = (src, ins) => [f => this.src.gameboard.subscribe("newturn", (t,s,d) => {
			if (ins[0] == null || ins[0].isPlaying)
				f(t,s,d);
		})];
		this.types = [Types.timestamp];
	}
}

module.exports = Timestamp;
var Bloc = require('./Bloc');
var Types = require('./Types');

class State extends Bloc {

	constructor (src, ctx) {

		super("state", src, ctx, true);
		this.f = (src, ins) => [this, null, (src, target) => target.states[ins[0]]];
		this.types = [Types.state];
	}

	setup () {

		var s = this.computeIn()[0];
		this.src.states[s] = true;
	}
}

module.exports = State;
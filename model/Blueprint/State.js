var Bloc = require('./Bloc');
var Types = require('./Types');

class State extends Bloc {

	constructor (src, ctx) {

		super("state", src, ctx);
		this.f = (src, ins) => [this, x => { x.states[ins[0]] = true; return x; }, target => target.hasState(ins[0])];
		this.types = [Types.state];
	}

	setup () {

		var s = this.computeIn()[0];
		this.src.states[s] = true;
	}
}

module.exports = State;
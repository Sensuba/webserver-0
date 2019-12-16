var Bloc = require('./Bloc');
var Types = require('./Types');

class State extends Bloc {

	constructor (src, ctx) {

		super("state", src, ctx);
		this.f = (src, ins) => [this, x => { x.states[ins[0]] = ins[1] !== undefined ? ins[1] : true; return x; }, target => target.hasState(ins[0]) === (ins[1] !== undefined ? ins[1] : true)];
		this.types = [Types.state, Types.bool];
	}

	setup () {

		var cpt = this.computeIn();
		var s = cpt[0];
		this.src.states[s] = cpt[1] !== undefined ? cpt[1] : true;
	}
}

module.exports = State;
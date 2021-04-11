var Bloc = require('./Bloc');
var Types = require('./Types');

class MergeMutations extends Bloc {

	constructor (src, ctx) {

		super("mergemutations", src, ctx);
		this.f = (src, ins, props) => [x => this.in[1](props)(this.in[0](props)(x))];
		this.types = [Types.mutation, Types.mutation];
	}

	execute (props) {
		
		props = props || {};
		let src = props.src || this.src;
		var f = this.f || (() => []);
		this.out = f(src, [], props);
		if (this.to)
			this.to.execute(props);
	}
}

module.exports = MergeMutations;
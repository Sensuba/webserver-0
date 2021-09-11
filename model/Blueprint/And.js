var Bloc = require('./Bloc');
var Types = require('./Types');

class And extends Bloc {

	constructor (src, ctx) {

		super("opand", src, ctx);
		this.f = (src, props) => {
			var a = this.in[0](props);
			if (!a)
				return [false];
			var b = this.in[1](props);
			return [b];
		}
		this.types = [Types.bool, Types.bool];
	}

	execute (props) {
		
		props = props || {};
		let src = props.src || this.src;
		var f = this.f || (() => []);
		this.out = f(src, props);
		if (this.to)
			this.to.execute(props);
	}
}

module.exports = And;
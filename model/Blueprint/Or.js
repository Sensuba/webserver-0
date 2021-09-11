var Bloc = require('./Bloc');
var Types = require('./Types');

class Or extends Bloc {

	constructor (src, ctx) {

		super("opor", src, ctx);
		this.f = (src, props) => {
			var a = this.in[0](props);
			if (a)
				return [true];
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

module.exports = Or;
var Bloc = require('./Bloc');
var Types = require('./Types');

class ConditionalTarget extends Bloc {

	constructor (src, ctx) {

		super("conditiontarget", src, ctx);
		this.f = (src, ins, props) => [(src, target) => ins[0](src, target) && this.in[1](props)];
		this.types = [Types.tilefilter, Types.bool];
	}

	execute (props) {
		
		props = props || {};
		let src = props.src || this.src;
		var f = this.f || (() => []);
		this.out = f(src, [this.in[0](props)], props);
		if (this.to)
			this.to.execute(props);
	}
}

module.exports = ConditionalTarget;
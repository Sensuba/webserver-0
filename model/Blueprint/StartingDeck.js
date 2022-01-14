var Bloc = require('./Bloc');
var Types = require('./Types');

class StartingDeck extends Bloc {

	constructor (src, ctx) {

		super("startdeck", src, ctx);
		this.f = (src, ins, props) => {
			var count = 0;
			if (ins[0].deck.starting) {
				ins[0].deck.starting.forEach(model => {
					let nprops = Object.assign({}, props);
					nprops.data = model;
					if (this.in[1](nprops)) {
						let add = this.in[2](nprops);
						count += add === null || add === undefined ? 1 : add;
					}
				})
			}
			return [count > 0, count];
		}
		this.types = [Types.area, Types.bool, Types.int];
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

module.exports = StartingDeck;
var Bloc = require('./Bloc');
var Types = require('./Types');

class Listener extends Bloc {

	constructor (src, ctx) {

		super("listener", src, ctx, true);
		this.f = (src, ins) => [this, this.data];
		this.types = [Types.event, Types.bool];
		this.out = [this, null];
	}

	setup (owner, image) {

		var cpt = this.computeIn();
		var event = cpt[0];
		var onBoard = cpt[1];
		event((t,s,d) => {
			if (!onBoard || owner.onBoard) {
				this.data = { src: s, data: d };
				this.execute(image);
			}
		});
	}
}

module.exports = Listener;
var Bloc = require('./Bloc');
var Types = require('./Types');
var Event = require('../Event');

class Listener extends Bloc {

	constructor (src, ctx) {

		super("listener", src, ctx, true);
		this.f = (src, ins) => [this, this.data];
		this.types = [Types.event, Types.bool];
	}

	setup () {

		var cpt = this.computeIn();
		var event = cpt[0];
		var onBoard = cpt[1];
		event((t,s,d) => {
			if (!onBoard || this.src.onBoard) {
				this.data = { src: s, data: d };
				this.execute();
			}
		});
	}
}

module.exports = Listener;
var Bloc = require('./Bloc');
var Types = require('./Types');
var EListener = require('../Listener');

class Listener extends Bloc {

	constructor (src, ctx) {

		super("listener", src, ctx, true);
		this.f = (src, ins) => [this, this.data];
		this.types = [Types.event, Types.bool];
		this.out = [this, null];
	}

	setup (owner, image) {

		var onBoard = this.in[1]();
		var that = this;
		owner.passives.push(new EListener(owner, () => this.in[0]().subscribe((t,s,d) => {
			if (!onBoard || owner.onBoard) {
				that.data = { src: s, data: d };
				that.execute({ src: owner, image: image });
			}
		}), !onBoard));
	}
}

module.exports = Listener;
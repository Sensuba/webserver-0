var Bloc = require('./Bloc');
var Types = require('./Types');

class Trigger extends Bloc {

	constructor (name, src, ctx, event) {

		super(name, src, ctx);
		this.f = (src, ins) => [f => this.src.gameboard.subscribe(event, f)];
		this.types = [];
	}
}

module.exports = Trigger;
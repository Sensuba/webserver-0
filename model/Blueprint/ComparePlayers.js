var Bloc = require('./Bloc');
var Types = require('./Types');

class ComparePlayers extends Bloc {

	constructor (src, ctx) {

		super("cmpplayers", src, ctx);
		this.f = (src, ins) => [ins[0].id === ins[1].id];
		this.types = [Types.area, Types.area];
	}
}

module.exports = ComparePlayers;
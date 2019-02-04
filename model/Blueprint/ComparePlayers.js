var Bloc = require('./Bloc');
var Types = require('./Types');

class ComparePlayers extends Bloc {

	constructor (src, ctx) {

		super("cmpplayers", src, ctx);
		this.f = (src, ins) => [ins[0] === ins[1]];
		this.types = [Types.area, Types.area];
	}
}

module.exports = ComparePlayers;
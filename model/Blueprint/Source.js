var Bloc = require('./Bloc');
var Types = require('./Types');

class Source extends Bloc {

	constructor (src, ctx) {

		super("source", src, ctx);
		this.f = (src, ins) => [this.src];
		this.types = [];
	}
}

module.exports = Source;
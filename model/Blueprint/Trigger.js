var Bloc = require('./Bloc');
var Event = require('./Event');

class Trigger extends Bloc {

	constructor (name, src, ctx, event) {

		super(name, src, ctx);
		this.f = (src, ins) => [ new Event(src, event, (s,t,d) => true) ];
		this.types = [];
	}
}

module.exports = Trigger;
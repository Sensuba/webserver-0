var Bloc = require('./Bloc');
var Types = require('./Types');
var Event = require('./Event');

class Timestamp extends Bloc {

	constructor (src, ctx) {

		super("timestamp", src, ctx);
		this.f = (src, ins) => [ new Event(this.src, "newturn", (t,s,d) => ins[0] === null || ins[0].isPlaying) ];
		this.types = [Types.timestamp];
	}
}

module.exports = Timestamp;
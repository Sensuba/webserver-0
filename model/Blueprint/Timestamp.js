var Bloc = require('./Bloc');
var Types = require('./Types');
var Event = require('./Event');

class Timestamp extends Bloc {

	constructor (src, ctx) {

		super("timestamp", src, ctx);
		this.f = (src, ins) => [ new Event(src, ins[0].time ? "endturn" : "newturn", (t,s,d) => ins[0].player === null || (ins[0].player === 1 && s.isPlaying) || (ins[0].player === 2 && s.opposite.isPlaying)) ];
		this.types = [Types.timestamp];
	}
}

module.exports = Timestamp;
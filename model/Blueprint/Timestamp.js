var Bloc = require('./Bloc');
var Types = require('./Types');
var Event = require('./Event');

class Timestamp extends Bloc {

	constructor (src, ctx) {

		super("timestamp", src, ctx);
		this.f = (src, ins) => [ new Event(src, this.timeToEvent(ins[0].time), (t,s,d) => (ins[0].player === null || ((ins[0].player === 0) === s.isPlaying))) ];
		this.types = [Types.timestamp];
	}

	timeToEvent (time) {

		switch (time) {
		case 0: return "newturn";
		case 1: return "endturn";
		case 2: return "cleanup";
		default: return "newturn";
		}
	}
}

module.exports = Timestamp;
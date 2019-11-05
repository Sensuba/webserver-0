var Bloc = require('./Bloc');
var Types = require('./Types');

class Timer extends Bloc {

	constructor (src, ctx) {

		super("timer", src, ctx);
		this.f = (src, ins, props) => {
			var unsub = src.gameboard.subscribe(ins[0].time ? "endturn" : "newturn", (t,s,d) => {
				if (ins[0].player === null || ins[0].player.isPlaying) {
					if (this.callback) {
						this.callback.execute(props);
						src.gameboard.update();
					}
					unsub();
				}
			})
		}
		this.types = [Types.timestamp];
		this.toPrepare.push("callback");
	}
}

module.exports = Timer;
var Bloc = require('./Bloc');
var Types = require('./Types');

class Timer extends Bloc {

	constructor (src, ctx) {

		super("timer", src, ctx);
		this.f = (src, ins, image) => {
			var unsub = src.gameboard.subscribe("newturn", (t,s,d) => {
				if (ins[0] === null || ins[0].isPlaying) {
					if (this.callback) {
						this.callback.execute(image);
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
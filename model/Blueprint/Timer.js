var Bloc = require('./Bloc');
var Types = require('./Types');

class Timer extends Bloc {

	constructor (src, ctx) {

		super("timer", src, ctx);
		this.f = (src, ins, props) => {
			ctx.image = (ctx.image || 0) + 1;
			var timerimage = ctx.image;
			Object.keys(ctx).filter(key => key !== "image").forEach(key => ctx[key].forEach((el, i) => {
				var bloc = ctx[key][i];
				if (bloc.out && bloc !== ins[1]) {
					bloc.images[ctx.image] = bloc.out;
				}
			}));
			var unsub = src.gameboard.subscribe(ins[0].time ? "endturn" : "newturn", (t,s,d) => {
				if (ins[0].player === null || ins[0].isPlaying) {
					if (this.callback) {
						this.callback.execute(Object.assign({}, props, {image: timerimage}));
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
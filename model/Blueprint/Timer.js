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
			var unsub = src.gameboard.subscribe(this.timeToEvent(ins[0].time), (t,s,d) => {
				if (ins[0].player === null || (src.area && (ins[0].player === 0 ? src.area : src.area.opposite).isPlaying)) {
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

	timeToEvent (time) {

		switch (time) {
		case 0: return "newturn";
		case 1: return "endturn";
		case 2: return "cleanup";
		default: return "newturn";
		}
	}
}

module.exports = Timer;
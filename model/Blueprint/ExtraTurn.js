var Bloc = require('./Bloc');
var Types = require('./Types');

class ExtraTurn extends Bloc {

	constructor (src, ctx) {

		super("extraturn", src, ctx, true);
		this.f = (src, ins) => {
			ctx.image = (ctx.image || 0) + 1;
			var timerimage = ctx.image;
			Object.keys(ctx).filter(key => key !== "image").forEach(key => ctx[key].forEach((el, i) => {
				var bloc = ctx[key][i];
				if (bloc.out && bloc !== ins[1]) {
					bloc.images[ctx.image] = bloc.out;
				}
			}));
			ins[0].extraTurn(() => {
				if (this.callback) {
					this.callback.execute(Object.assign({}, props, {image: timerimage}));
					src.gameboard.update();
				}
			});
			return [];
		};
		this.types = [Types.area];
		this.toPrepare.push("callback");
	}
}

module.exports = ExtraTurn;
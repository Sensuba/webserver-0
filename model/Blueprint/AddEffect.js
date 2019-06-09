var Bloc = require('./Bloc');
var Types = require('./Types');

class AddEffect extends Bloc {

	constructor (src, ctx) {

		super("addeffect", src, ctx, true);
		this.f = (src, ins) => {
			ctx.image = (ctx.image || 0) + 1;
			Object.keys(ctx).filter(key => key !== "image").forEach(key => ctx[key].forEach((el, i) => {
				var bloc = ctx[key][i];
				if (bloc.out && bloc !== ins[1]) {
					bloc.images[ctx.image] = bloc.out;
				}
			}));
			ins[1].setup(ins[0], ctx.image);
			return [];
		};
		this.types = [Types.card, Types.effect];
	}
}

module.exports = AddEffect;
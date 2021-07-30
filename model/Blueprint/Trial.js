var Bloc = require('./Bloc');
var Types = require('./Types');

class Trial extends Bloc {

	constructor (src, ctx) {

		super("trial", src, ctx, true);
		this.f = (src, ins) => [this];
		this.types = [Types.bool, Types.int, Types.int];
		this.out = [this];
		this.trigger = (src, image) => this.execute({src, image});
	}

	setup (owner, image) {

		var that = this;
		owner.steps = owner.steps || [];
		var step = {
			step: this.in[1](),
			condition: () => that.in[0](),
			trigger: () => that.trigger(owner, image),
			completed: false
		}
		let i = 0;
		while (i < owner.steps.length) {
			if (owner.steps[i].step > step.step)
				break;
			i++;
		}
		owner.steps.splice(i, 0, step);
		owner.innereffects.push(this);
	}
}

module.exports = Trial;
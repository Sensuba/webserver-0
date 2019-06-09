class Bloc {

	constructor (type, src, ctx, stc = false) {

		this.ctx = ctx;
		this.src = src;
		this.type = type;
		this.static = stc;
		this.in = [];
		this.types = [];
		this.images = {};
		this.toPrepare = ["to"];
	}

	execute (src) {
		
		var f = this.f || (() => []);
		this.out = f(this.src, this.computeIn(src), src);
		if (this.to)
			this.to.execute(src);
	}

	prepare (src, blueprint) {

		this.toPrepare.forEach(to => {
			if (src[to] !== undefined && src[to] !== null) {
				this[to] = this.ctx.actions[src[to]];
				this[to].prepare(blueprint.actions[src[to]], blueprint);
			}
		});
	}

	setup(owner) {

	}

	compute (src) {

		if (src && this.images[src])
			return this.images[src];
		if (this.static && this.out !== null && this.out !== undefined)
			return this.out;
		this.execute(src);
		return this.out;
	}

	computeIn(src) {

		return this.in.map(el => el(src));
	}

	updateIn(ins) {

		this.in = ins.map((el, i) => {
			if (el !== null && typeof el === 'object')
				return (src) => this.ctx[el.type][el.index].compute(src)[el.out];
			return (src) => (this.types[i] || (x => x))(el, this.src);
		})
	}
}

module.exports = Bloc;
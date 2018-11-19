class Bloc {

	constructor (type, src, ctx) {

		this.ctx = ctx;
		this.src = src;
		this.type = type;
		this.in = [];
		this.types = [];
	}

	execute () {

		var f = this.f || (() => []);
		this.out = f(this.src, this.computeIn());
		if (this.to)
			this.to.execute();
	}

	prepare (src, blueprint) {

		if (src.to !== undefined && src.to !== null) {
			this.to = this.ctx.actions[src.to];
			this.to.prepare(blueprint.actions[src.to]);
		}
	}

	setup() {

	}

	compute () {

		if (this.out !== null && this.out !== undefined)
			return this.out;
		this.execute();
		return this.out;
	}

	computeIn() {

		return this.in.map(el => el());
	}

	updateIn(ins) {

		this.in = ins.map((el, i) => {
			if (el !== null && typeof el === 'object')
				return () => this.ctx[el.type][el.index].compute()[el.out];
			return () => (this.types[i] || (x => x))(el, this.src);
		})
	}
}

module.exports = Bloc;
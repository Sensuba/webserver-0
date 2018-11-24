class Bloc {

	constructor (type, src, ctx, stc = false) {

		this.ctx = ctx;
		this.src = src;
		this.type = type;
		this.static= stc;
		this.in = [];
		this.types = [];
		this.toPrepare = ["to"];
	}

	execute () {

		var f = this.f || (() => []);
		this.out = f(this.src, this.computeIn());
		if (this.to)
			this.to.execute();
	}

	prepare (src, blueprint) {

		this.toPrepare.forEach(to => {
			if (src[to] !== undefined && src[to] !== null) {
				this[to] = this.ctx.actions[src[to]];
				this[to].prepare(blueprint.actions[src[to]], blueprint);
			}
		});
	}

	setup() {

	}

	compute () {

		if (this.static && this.out !== null && this.out !== undefined)
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
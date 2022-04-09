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

	execute (props) {
		
		props = props || {};
		let src = props.src || this.src;
		var f = this.f || (() => []);
		this.out = f(src, this.computeIn(props), props);
		if (this.to)
			this.to.execute(props);
	}

	prepare (src, blueprint) {

		if (this.prepared)
			return;
		this.prepared = true;
		this.toPrepare.forEach(to => {
			if (src[to] !== undefined && src[to] !== null) {
				this[to] = this.ctx.actions[src[to]];
				this[to].prepare(blueprint.actions[src[to]], blueprint);
			}
		});
	}

	setup(owner) {

	}

	compute (props) {

		props = props || {};
		if (this.static && props.image && this.images[props.image])
			return this.images[props.image];
		if (this.static && this.out !== null && this.out !== undefined)
			return this.out;
		this.execute(props);
		return this.out;
	}

	computeIn(props) {

		return this.in.map(el => el(props));
	}

	computeSingle(no, props) {

		return this.in[no](props);
	}

	updateIn(ins) {

		this.in = ins.map((el, i) => {
			if (el !== null && typeof el === 'object')
				return (props) => this.ctx[el.type][el.index].compute(props)[el.out];
			return (props) => (this.types[i] || (x => x))(el, props && props.src ? props.src : this.src);
		})
	}
}

module.exports = Bloc;
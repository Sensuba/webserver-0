var Bloc = require('./Bloc');
var Types = require('./Types');

class Analyse extends Bloc {

	constructor (src, ctx) {

		super("analyse", src, ctx);
		this.f = (src, ins, props) => {
			var count = 0;
			switch (ins[1]) {
				case 0: count = this.countAllGame(ins[0], props); break;
				case 1: count = this.countThisTurn(ins[0], props); break;
				case 2: count = this.countAllGame(ins[0], props); break;
				case 3: count = this.countSincePreviousTurn(ins[0], props); break;
				case 4: count = this.countPreviousTurn(ins[0], props); break;
				case 5: count = this.countYourTurn(ins[0], props); break;
				case 6: count = this.countSinceYourTurn(ins[0], props); break;
				default: break;
			}
			return [count > 0, count];
		}
		this.types = [Types.event, Types.period, Types.bool, Types.int];
	}

	execute (props) {
		
		props = props || {};
		let src = props.src || this.src;
		var f = this.f || (() => []);
		this.out = f(src, [this.in[0](props), this.in[1](props)], props);
		if (this.to)
			this.to.execute(props);
	}

	countThisTurn (event, props) {

		let c = 0;
		event.gameboard.log.logs.forEach(log => {
			if (log.type === "newturn")
				c = 0;
			let nprops = Object.assign({}, props);
			nprops.data = { src:log.src, data:log.data };
			if (event.check(log.type, log.src, log.data) && this.in[2](nprops)) {
				let add = this.in[3] ? this.in[3](nprops) : null;
				c += add === null || add === undefined ? 1 : add;
			}
		})
		return c;
	}

	countSincePreviousTurn (event, props) {

		let c = 0;
		event.gameboard.log.logs.forEach(log => {
			if (log.type === "newturn" && log.src.id.no !== this.src.area.id.no)
				c = 0;
			let nprops = Object.assign({}, props);
			nprops.data = { src:log.src, data:log.data };
			if (event.check(log.type, log.src, log.data) && this.in[2](nprops)) {
				let add = this.in[3] ? this.in[3](nprops) : null;
				c += add === null || add === undefined ? 1 : add;
			}
		})
		return c;
	}

	countPreviousTurn (event, props) {

		let c = 0, n = 0, you = false;
		event.gameboard.log.logs.forEach(log => {
			if (log.type === "newturn") {
				if (log.src.id.no === this.src.area.id.no) {
					you = true;
					c = n;
					n = 0;
				} else you = false;
			}
			if (!you)
				return;
			let nprops = Object.assign({}, props);
			nprops.data = { src:log.src, data:log.data };
			if (event.check(log.type, log.src, log.data) && this.in[2](nprops)) {
				let add = this.in[3] ? this.in[3](nprops) : null;
				n += add === null || add === undefined ? 1 : add;
			}
		})
		return c;
	}

	countYourTurn (event, props) {

		let c = 0, you = false;
		event.gameboard.log.logs.forEach(log => {
			if (log.type === "newturn") {
				if (log.src.id.no === this.src.area.id.no) {
					you = true;
					c = 0;
				} else you = false;
			}
			if (!you)
				return;
			let nprops = Object.assign({}, props);
			nprops.data = { src:log.src, data:log.data };
			if (event.check(log.type, log.src, log.data) && this.in[2](nprops)) {
				let add = this.in[3] ? this.in[3](nprops) : null;
				c += add === null || add === undefined ? 1 : add;
			}
		})
		return c;
	}

	countSinceYourTurn (event, props) {

		let c = 0;
		event.gameboard.log.logs.forEach(log => {
			if (log.type === "newturn" && log.src.id.no === this.src.area.id.no)
				c = 0;
			let nprops = Object.assign({}, props);
			nprops.data = { src:log.src, data:log.data };
			if (event.check(log.type, log.src, log.data) && this.in[2](nprops)) {
				let add = this.in[3] ? this.in[3](nprops) : null;
				c += add === null || add === undefined ? 1 : add;
			}
		})
		return c;
	}

	countAllGame (event, props) {

		return event.gameboard.log.logs.reduce((acc, log) => {
			let nprops = Object.assign({}, props);
			nprops.data = { src:log.src, data:log.data };
			if (event.check(log.type, log.src, log.data) && this.in[2](nprops)) {
				let add = this.in[3] ? this.in[3](nprops) : null;
				return acc + (add === null || add === undefined ? 1 : add);
			}
			return acc;
		}, 0);
	}
}

module.exports = Analyse;
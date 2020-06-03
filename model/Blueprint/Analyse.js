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
				case 4: count = this.countAllGame(ins[0], props); break;
				case 5: count = this.countYourTurn(ins[0], props); break;
				case 6: count = this.countSinceYourTurn(ins[0], props); break;
				default: break;
			}
			return [count > 0, count];
		}
		this.types = [Types.event, Types.period, Types.bool];
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
			if (event.check(log.type, log.src, log.data) && this.in[2](nprops))
				c++;
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
			if (event.check(log.type, log.src, log.data) && this.in[2](nprops))
				c++;
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
			nprops.data = this.buildEvent(event.gameboard, log);
			if (event.check(log.type, log.src, log.data) && this.in[2](nprops))
				c++;
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
			if (event.check(log.type, log.src, log.data) && this.in[2](nprops))
				c++;
		})
		return c;
	}

	countAllGame (event, props) {

		return event.gameboard.log.logs.filter(log => {
			let nprops = Object.assign({}, props);
			nprops.data = { src:log.src, data:log.data };
			return event.check(log.type, log.src, log.data) && this.in[2](nprops)
		}).length;
	}
}

module.exports = Analyse;
var Bloc = require('./Bloc');
var Types = require('./Types');

class Analyse extends Bloc {

	constructor (src, ctx) {

		super("analyse", src, ctx);
		this.f = (src, ins, image) => {
			var count = 0;
			switch (ins[1]) {
				case 0: count = this.countAllGame(ins[0], image); break;
				case 1: count = this.countThisTurn(ins[0], image); break;
				case 2: count = this.countAllGame(ins[0], image); break;
				case 3: count = this.countSincePreviousTurn(ins[0], image); break;
				case 4: count = this.countAllGame(ins[0], image); break;
				default: break;
			}
			return [count > 0, count];
		}
		this.types = [Types.event, Types.period, Types.bool];
	}

	execute (src, data) {
		
		var f = this.f || (() => []);
		this.out = f(this.src, [this.in[0](src, data), this.in[1](src, data)], src, data);
		if (this.to)
			this.to.execute(src);
	}

	countThisTurn (event, image) {

		let c = 0;
		event.gameboard.log.logs.forEach(log => {
			if (log.type === "newturn")
				c = 0;
			if (event.check(log.type, log.src, log.data) && this.in[2](image, { src:log.src, data:log.data }))
				c++;
		})
		return c;
	}

	countSincePreviousTurn (event, image) {

		let c = 0;
		event.gameboard.log.logs.forEach(log => {
			if (log.type === "newturn" && log.src.id.no !== this.src.area.id.no)
				c = 0;
			if (event.check(log.type, log.src, log.data) && this.in[2](image, { src:log.src, data:log.data }))
				c++;
		})
		return c;
	}

	countAllGame (event, image) {

		return event.gameboard.log.logs.filter(log => event.check(log.type, log.src, log.data) && this.in[2](image, { src:log.src, data:log.data })).length;
	}
}

module.exports = Analyse;
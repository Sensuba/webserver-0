var Bloc = require('./Bloc');
var Types = require('./Types');

class ForEachEvent extends Bloc {

	constructor (src, ctx) {

		super("forevent", src, ctx);
		this.f = (src, ins, props) => {
			var logs = [];
			switch (ins[1]) {
				case 0: logs = this.logsAllGame(ins[0], props); break;
				case 1: logs = this.logsThisTurn(ins[0], props); break;
				case 2: logs = this.logsAllGame(ins[0], props); break;
				case 3: logs = this.logsSincePreviousTurn(ins[0], props); break;
				case 4: logs = this.logsAllGame(ins[0], props); break;
				default: break;
			}

			logs.forEach (logs => {
				if (this["for each"])
					this["for each"].execute(props);
			})
			this.out = null;
			if (this.completed)
				this.completed.execute(props);
			return;
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

	logsThisTurn (event, props) {

		let c = [];
		event.gameboard.log.logs.forEach(log => {
			if (log.type === "newturn")
				c = [];
			let nprops = Object.assign({}, props);
			nprops.data = { src:log.src, data:log.data };
			if (event.check(log.type, log.src, log.data) && this.in[2](nprops))
				c.push(nprops.data);
		})
		return c;
	}

	logsSincePreviousTurn (event, props) {

		let c = [];
		event.gameboard.log.logs.forEach(log => {
			if (log.type === "newturn" && log.src.id.no !== this.src.area.id.no)
				c = [];
			let nprops = Object.assign({}, props);
			nprops.data = { src:log.src, data:log.data };
			if (event.check(log.type, log.src, log.data) && this.in[2](nprops))
				c.push(nprops.data);
		})
		return c;
	}

	logsAllGame (event, props) {

		return event.gameboard.log.logs.filter(log => {
			let nprops = Object.assign({}, props);
			nprops.data = { src:log.src, data:log.data };
			return event.check(log.type, log.src, log.data) && this.in[2](nprops)
		});
	}
}

module.exports = ForEachEvent;
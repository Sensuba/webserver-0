var Bloc = require('./Bloc');
var Types = require('./Types');

class FirstLastCards extends Bloc {

	constructor (src, ctx) {

		super("flcards", src, ctx, true);
		this.f = (src, ins, props) => {
			var loc = ins[0], targets = ins[3];
			if (ins[2] === null || ins[2] === undefined)
				ins[2] = 1;
			var count = 0;
			var list = ins[1] ? loc.cards : loc.cards.reverse();
			for (var i = 0; i < list.length && count < ins[2]; i++) {
				if (targets === null || targets(list[i])) {
					this.out = [list[i]];
					if (this["for each"])
						this["for each"].execute(props);
					count++;
				}
			}
			this.out = null;
			if (this.completed)
				this.completed.execute(props);
			return;
		}
		this.types = [Types.location, Types.bool, Types.int, Types.cardfilter];
		this.toPrepare.push("for each");
		this.toPrepare.push("completed");
	}
}

module.exports = FirstLastCards;
var Bloc = require('./Bloc');
var Types = require('./Types');

class OpenChoosebox extends Bloc {

	constructor (src, ctx) {

		super("choosebox", src, ctx, true);
		var that = this;
		this.f = (src, ins) => {
			var choosebox = src.gameboard.currentArea.choosebox;
			if (!choosebox.isEmpty)
				choosebox.open(choice => {
					if (ins[0])
						choosebox.cards.forEach(card => card.anihilate());
					that.out = [choice];
					if (that.to)
						that.to.execute(that.toprops);
				});
			return [];
		};
		this.types = [Types.bool];
	}

	execute (props) {
		
		props = props || {};
		let src = props.src || this.src;
		var f = this.f || (() => []);
		this.out = f(src, this.computeIn(props), props);
		this.toprops = props;
	}
}

module.exports = OpenChoosebox;
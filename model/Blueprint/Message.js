var Bloc = require('./Bloc');
var Types = require('./Types');

class Message extends Bloc {

	constructor (src, ctx) {

		super("message", src, ctx, true);
		this.f = (src, ins) => this.src.gameboard.whisper("message", ins[1].id.no, this.src.gameboard.id, { type: "string", value: ins[0] });
		this.types = [Types.string, Types.area];
	}
}

module.exports = Message;
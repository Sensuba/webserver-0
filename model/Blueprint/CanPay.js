var Bloc = require('./Bloc');
var Types = require('./Types');

class CanPay extends Bloc {

	constructor (src, ctx) {

		super("canpay", src, ctx);
		this.f = (src, ins) => [ins[0].manapool.canPay(ins[1])];
		this.types = [Types.area, Types.int];
	}
}

module.exports = CanPay;
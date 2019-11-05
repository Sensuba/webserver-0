var Bloc = require('./Bloc');

class InnerData extends Bloc {

	constructor (src, ctx) {

		super("innerdata", src, ctx);
		this.f = (src, ins, props) => [props.data];
		this.types = [];
	}
}

module.exports = InnerData;
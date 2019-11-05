var Bloc = require('./Bloc');

class Contact extends Bloc {

	constructor (src, ctx) {

		super("contact", src, ctx, true);
		this.f = (src, ins) => [this, this.other];
		this.types = [];
		this.out = [this, null];
	}

	setup (owner, image) {

		var that = this;
		owner.passives.push(new Listener(owner, () => that.src.gameboard.subscribe("charcontact", (t,s,d) => {
			if (s === owner || d[0] === owner) {
				this.other = s === owner ? d[0] : s;
				this.execute({src: owner, image: image});
			}
		})));
	}
}

module.exports = Contact;
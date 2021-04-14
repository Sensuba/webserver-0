var Bloc = require('./Bloc');
var Listener = require('../Listener');

class Contact extends Bloc {

	constructor (src, ctx) {

		super("contact", src, ctx, true);
		this.f = (src, ins) => [this, this.other];
		this.types = [];
		this.out = [this, null];
	}

	setup (owner, image) {

		var that = this;
		owner.passives.push(new Listener(owner, own => that.src.gameboard.subscribe("charcontact", (t,s,d) => {
			if (s === own || d[0] === own) {
				this.other = s === own ? d[0] : s;
				this.execute({src: own, image: image});
			}
		})));
		owner.innereffects.push(this);
	}
}

module.exports = Contact;
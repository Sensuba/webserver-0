class Listener {

	constructor (src, subscribe) {
		
		this.src = src;
		this.subscribe = subscribe;
		this.unsubscribe = () => {};
		this.activated = false;
		if (src.activated)
			this.activate();
	}

	activate () {

		if (this.activated)
			return;
		this.unsubscribe = this.subscribe();
		this.activated = true;
	}

	deactivate () {

		if (!this.activated)
			return;
		this.unsubscribe();
		this.activated = false;
	}
}

module.exports = Listener;
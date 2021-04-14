class Listener {

	constructor (src, subscribe, globaleff) {
		
		this.src = src;
		this.subscribe = subscribe;
		this.globaleff = globaleff;
		this.unsubscribe = () => {};
		this.activated = false;
		if (src.activated || globaleff)
			this.activate();
	}

	activate () {

		if (this.activated)
			return;
		this.unsubscribe = this.subscribe(this.src);
		this.activated = true;
	}

	deactivate () {

		if (!this.activated)
			return;
		this.unsubscribe();
		this.activated = false;
	}

	copy (src) {

		return new Listener(src, this.subscribe, this.globaleff);
	}
}

module.exports = Listener;


class User {

	constructor (socket,id, manager, name, avatar) {

		this.socket = socket;
		this.id = id;
		socket.user = this;
		this.manager = manager;
		this.name = name;
		this.avatar = avatar;
		this.waitingList = [];
	}

	emit (n, data) {

		if (this.disconnected || this.waitingList.length > 0) {
			this.waitingList.push({n , data});
		}
		else this.socket.emit(n, data);
	}

	disconnect () {

		this.disconnected = true;
	}

	reconnect (socket, resync) {

		this.socket = socket;
		socket.user = this;
		delete this.disconnected;
		if (this.warning) {
			clearTimeout(this.warning);
			delete this.warning;
		}
		if (resync)
			this.waitingList = [];
		while (this.waitingList.length > 0) {
			var not = this.waitingList.shift();
			this.socket.emit(not.n, not.data);
		}
	}

	warn (time) {

		console.log("Player " + (this.name || "Anonymous") + " disconnected from " + this.manager.room);
		this.warning = setTimeout(() => {
			if (this.manager)
				this.manager.kick(this)
		}, time);
	}
}

module.exports = User;
var Bank = (() => {

	this.list = {};

	init = (url, callback, error) => {

		var axios = require('axios');
		this.client = axios.create({
	    	baseURL: url,
	      	headers: { 'X-Requested-With': 'XMLHttpRequest' }
	    });
	    this.client.get("/vault/cardmodels")
	  	.then(response => {
	  		var atob = require('atob');
	  		response.data.forEach(el => this.list[el.idCardmodel] = Object.assign(el, JSON.parse(atob(el.supercode))));
	  		callback(response.data);
	  	})
	  	.catch(error);
	}

	get = model => {

		if (typeof model === "object") {

			var parent = get(model.parent);
			parent.tokens[model.token].parent = parent;
			return Object.assign({}, parent.tokens[model.token], {notoken: model.token});
		}
		return Object.assign({}, this.list[model]);
	};

	return {
		init: init,
		get: get,
		list: () => Object.assign({}, this.list)
	}
})();

module.exports = Bank;
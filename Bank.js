var Bank = (() => {

	this.list = {};

	init = (url, callback) => {

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
	  	.catch(err => {});
	}

	get = no => Object.assign({}, this.list[no]);

	return {
		init: init,
		get: get
	}
})();

module.exports = Bank;
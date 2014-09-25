(function (D3) {
	
	var PREFIX = "D3:",
		wrapedKey = function(key){
			return PREFIX + key;
		};
	
	D3.Storage = {};
	
	D3.Storage.put = function(key, value){
		localStorage.setItem(wrapedKey(key), JSON.stringify(value));
	};
	
	D3.Storage.get = function(key){
		var value = localStorage.getItem(wrapedKey(key));
		return JSON.parse(value);
	};

}( window.D3 = window.D3 || {}));
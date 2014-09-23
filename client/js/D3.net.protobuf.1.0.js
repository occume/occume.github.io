(function (D3) {
	"use strict";
	
	if (typeof dcodeIO === 'undefined' || !dcodeIO.ProtoBuf) {
	    throw(new Error("ProtoBuf.js is not present. Please see www/index.html for manual setup instructions."));
	}
	// Initialize ProtoBuf.js
	var ProtoBuf = dcodeIO.ProtoBuf;
	var Game = ProtoBuf.loadProtoFile("./proto/ptoto/game.proto").build("Game");
	
}( window.D3 = window.D3 || {}));
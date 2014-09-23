(function (D3) {
	"use strict";
	
	if (typeof dcodeIO === 'undefined' || !dcodeIO.ProtoBuf) {
	    throw(new Error("ProtoBuf.js is not present. Please see www/index.html for manual setup instructions."));
	}
	// Initialize ProtoBuf.js
	var ProtoBuf = dcodeIO.ProtoBuf,
		Game = ProtoBuf.loadProtoFile("./proto/proto/game.proto").build("Game"),
		Login = Game.Login,
		Chat = Game.Chat;
	
	var chatMsg = new Chat("jd", "occume", "hello");
	var b = new Uint8Array(chatMsg.toArrayBuffer().byteLength + 1);
	b[0] = 1;
	b.set(chatMsg.toArrayBuffer(), 1);
	console.log(b.byteLength);
	D3.PB = {};
	D3.PB.loginPacket = function(){
		var loginMsg = new Login("occume", "阿斯蒂芬");
//		var b = new Uint8Array(loginMsg.toArrayBuffer().byteLength + 1);
//		b[0] = 1;
//		b.set(loginMsg.toArrayBuffer(), 1);
		return loginMsg.toArrayBuffer();
	};
}( window.D3 = window.D3 || {}));
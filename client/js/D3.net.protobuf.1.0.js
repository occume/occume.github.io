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
	
//	var chatMsg = new Chat("jd", "occume", "hello");
//	var b = new Int8Array(chatMsg.toArrayBuffer().byteLength + 1);
//	b[0] = 1;
//	b.set(chatMsg.toArrayBuffer(), 1);
//	console.log(b.byteLength);
	var Parser = function(){
		var parsers = {
			"1": Login,
			"2": Chat
		};
		return {
			getParser: function(module){
				return parsers[module];
			}
		};
	}();
	
	D3.Codecs.PB = {
		encoder: {transform: function (data){ return JSON.stringify(data);}},
		decoder: {transform: function (data){
				var b = dcodeIO.ByteBuffer.wrap(data);
				var module = b.readByte(),
					cmd = b.readByte(),
					_data = b.slice(2, b.capacity() - 2);
				var response = Parser.getParser(module, cmd).decode(_data);
				return {module: module, cmd: cmd, data: response};
			}
		}
	};
	
	D3.PB = {};
	D3.PB.Packets = {
		login: 	function(user){
			var constructor = Parser.getParser(D3.Module.LOGIN);
			var loginMsg = new constructor("八千里路云和月", "123");
			var b = new dcodeIO.ByteBuffer(loginMsg.toArrayBuffer().byteLength + 2);
			b.writeByte(D3.Module.LOGIN);
			b.writeByte(D3.Module.Login.DFT);

			b.append(loginMsg.toArrayBuffer());
//			console.log(b.toDebug());
			return b.buffer;
		},
		roomList: function(){
			var b = new dcodeIO.ByteBuffer(2);
			b.writeByte(D3.Module.CHAT);
			b.writeByte(D3.Module.Chat.ROOMLIST);
			return b.buffer;
		},
		enterRoom: function(data){
			var b = new dcodeIO.ByteBuffer(2);
			b.writeByte(D3.Module.CHAT);
			b.writeByte(D3.Module.Chat.ENTER_ROOM);
			b.writeCString(data);
			return b.buffer;
		}
	}; 
	
}( window.D3 = window.D3 || {}));
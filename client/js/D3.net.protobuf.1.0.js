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
	
	var Parser = function(){
		var parsers = {
			"1": Login,
			"2": Chat,
			"3": Chat
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
		compsiteBuffer: function(module, cmd, buf){
			var b = new dcodeIO.ByteBuffer(buf.toArrayBuffer().byteLength + 2);
			b.writeByte(module);
			b.writeByte(cmd);
			b.append(buf.toArrayBuffer());
			return b.buffer;
		},
		login: 	function(user){
			var constructor = Parser.getParser(D3.Module.LOGIN);
			var loginMsg = new constructor(user.name || "八千里路云和月", "123");
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
			b.writeByte(D3.Module.Chat.ROOM_LIST);
			return b.buffer;
		},
		enterRoom: function(id){
			var constructor = Parser.getParser(D3.Module.CHAT),
				msg = new constructor("ROOM", "", "", jOne.String.valueOf(id));
			var b = new dcodeIO.ByteBuffer(msg.toArrayBuffer().byteLength + 2);
			b.writeByte(D3.Module.CHAT);
			b.writeByte(D3.Module.Chat.ENTER_ROOM);
			b.append(msg.toArrayBuffer());
			return b.buffer;
		},
		chat: function(chatInfo){
			var constructor = Parser.getParser(D3.Module.CHAT),
				msg = new constructor(chatInfo.type, chatInfo.name, chatInfo.target, chatInfo.info);
			var b = new dcodeIO.ByteBuffer(msg.toArrayBuffer().byteLength + 2);
			b.writeByte(D3.Module.CHAT);
			b.writeByte(D3.Module.Chat.CHAT);
			b.append(msg.toArrayBuffer());
			return b.buffer;
		},
		lookup: function(param){
			var constructor = Parser.getParser(D3.Module.CHAT),
				buf = new constructor(param.type, param.name, param.target, param.info),
				module = D3.Module.USER,
				cmd = D3.Module.User.LOOKUP;
			
			return this.compsiteBuffer(module, cmd, buf);
		},
		addFriend: function(param){
			var constructor = Parser.getParser(D3.Module.CHAT),
			buf = new constructor(param.type, param.name, param.target, param.info),
			module = D3.Module.USER,
			cmd = D3.Module.User.MESSAGE;
		
			return this.compsiteBuffer(module, cmd, buf);
		}
	}; 
	
}( window.D3 = window.D3 || {}));
(function (D3) {
	"use strict";
	
	D3.Chat = {
		init: function(){
			D3.addProcessor(D3.Module.CHAT, D3.Module.Chat.ENTER_ROOM,
			function(rep){
				/**
				 * 加入房间 事件
				 */
				D3.event(D3.event.ENTER_ROOM_REP, null, rep);
			});
			
			D3.addProcessor(D3.Module.CHAT, D3.Module.Chat.LEAVE_ROOM,
			function(rep){
				/**
				 * 离开房间 事件
				 */
				D3.event(D3.event.LEAVE_ROOM_REP, null, rep);
			});
			
			D3.addProcessor(D3.Module.CHAT, D3.Module.Chat.CHAT,
			function(rep){
				/**
				* 聊天信息 事件
				*/
				if(rep.type == "ALL"){
					
				}
				else if(rep.type == "ROOM"){
					D3.event(D3.event.CHAT_2_ROOM_REP, null, rep);
				}
				else{
					D3.event(D3.event.CHAT_2_ONE_REP, null, rep);
				}
			});
			this.register();
		},
		register: function(){
			/**
			 * 如果注册事件不能正确执行 检查 1.回调函数名称是否正确 2.注册中心是否存在该事件
			 */
			D3.event.on(D3.event.ON_LOGIN, this.askRoomList);
			D3.event.on(D3.event.ENTER_ROOM_ASK, this.askEnterRoom);
			D3.event.on(D3.event.CHAT_2_ROOM_ASK, this.askChat2Room);
			D3.event.on(D3.event.CHAT_2_ONE_ASK, this.askChat2One);
		},
		askRoomList: function(){
			
			D3.addProcessor(D3.Module.CHAT, D3.Module.Chat.ROOM_LIST,
			function(rep){
//				Room.init();
//				RoomList.showMe(pkt);
				/**
				 *  房间列表信息 事件
				 */
				var rooms = JSON.parse(rep.info);
				D3.event(D3.event.ROOM_LIST_REP, null, rooms);
			});

			var rst = D3[D3.PROTOCOL].Packets.roomList();
			D3.session.send(rst);
		},
		askEnterRoom: function(id){
			
			var rst = D3[D3.PROTOCOL].Packets.enterRoom(id);
			D3.session.send(rst);
		},
		askChat2Room: function(msg){
	
			var user = D3.session.get(D3.Key.USER),
				chatInfo = {name: user.name,
							type: "ROOM",
							target: "",
							info: msg},
				rst = D3[D3.PROTOCOL].Packets.chat(chatInfo);
			console.log(111);
//			for(var i = 0; i < 10000000; i++)
//			D3.session.send(rst);
			setInterval(function(){
				for(var i = 0; i < 1000; i++)
					D3.session.send(rst);
			}, 100);
		},
		askChat2One: function(msg){
			var user = D3.session.get(D3.Key.USER),
			ask = D3[D3.PROTOCOL].Packets.chat({type: "ONE", name: user.name, target: msg.target, info: msg.info});
//			D3.session.send(ask);
			
			setInterval(function(){
				for(var i = 0; i < 1000; i++)
					D3.session.send(ask);
			}, 100);
		}
	};
	
	D3.Chat.init();
	
}( window.D3 = window.D3 || {}));
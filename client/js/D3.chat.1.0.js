(function (D3) {
	"use strict";
	
	D3.Chat = {
		init: function(){
			this.register();
		},
		register: function(){
			/**
			 * 如果注册事件不能正确执行 检查 1.回调函数名称是否正确 2.注册中心是否存在该事件
			 */
			D3.event.on(D3.event.ON_LOGIN, this.roomList);
			D3.event.on(D3.event.ENTER_ROOM_RST, this.enterRoom);
		},
		roomList: function(){
			
			D3.addProcessor(D3.Module.CHAT, D3.Module.Chat.ROOM_LIST,
			function(pkt){
//				Room.init();
//				RoomList.showMe(pkt);
				/**
				 *  房间列表信息 事件
				 */
				var rooms = JSON.parse(pkt.info);
				D3.event(D3.event.ROOM_LIST, null, rooms);
			});
			console.log(123);
			var rst = D3[D3.PROTOCOL].Packets.roomList();
			console.log(123);
			D3.session.send(rst);
		},
		enterRoom: function(id){
			
			D3.addProcessor(D3.Module.CHAT, D3.Module.Chat.ROOM_LIST,
			function(pkt){
				/**
				 * 加入房间 事件
				 */
				var rooms = JSON.parse(pkt.info);
				D3.event(D3.event.ENTER_ROOM_REP, null, rooms);
			});
			var rst = D3[D3.PROTOCOL].Packets.enterRoom();
			D3.session.send(rst);
		}
	};
	
	D3.Chat.init();
	
}( window.D3 = window.D3 || {}));
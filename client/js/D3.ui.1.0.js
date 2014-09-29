(function (D3) {
	"use strict";
	
	D3.UI = {};
	
	var Statu = Class.create({
		init: function(){
			this.register();
			this.bind();
		},
		register: function(){
			D3.event.on(D3.event.ON_LINE, this.online);
			D3.event.on(D3.event.OFF_LINE, this.offline);
		},
		online: function(){
			$("#d3_state img").attr("src", "/client/img/green.png");
		},
		offline: function(){
			$("#d3_state img").attr("src", "/client/img/red.png");
		},
		bind: function(){
			
			$("#d3_room").click(function(){
				_main.showRoom();
			});
			
			$("#d3_hall").click(function(){
				_main.showHall();
			});
		}
	});
	D3.UI.Statu = new Statu();
	
	var Main = Class.create({
		init: function(){
			this.register();
			this.main = $("#wrapper1");
		},
		register: function(){
			D3.event.on(D3.event.ON_LINE, this.online.bind(this));
			D3.event.on(D3.event.OFF_LINE, this.offline.bind(this));
		},
		online: function(){
			this.main.scrollTo("#box12", 500);
		},
		offline: function(){
			this.main.scrollTo("#box11", 500);
		},
		showRoom: function(rep){
			this.main.scrollTo("#box13", 500);
		},
		showHall: function(rep){
			this.main.scrollTo("#box12", 500);
		}
	});
	var _main = D3.UI.Main = new Main();
	
	var Room = Class.create({
		init: function(){
			this.register();
			this.bind();
		},
		register: function(){
			/**
			 *  房间列表请求成功
			 */
			D3.event.on(D3.event.ROOM_LIST_REP, this.onRoomList.bind(this));
			D3.event.on(D3.event.ENTER_ROOM_REP, this.onEnterRoom.bind(this));
			D3.event.on(D3.event.LEAVE_ROOM_REP, this.onLeaveRoom.bind(this));
			D3.event.on(D3.event.CHAT_REP, this.onChat.bind(this));
		},
		onRoomList: function(rep){
			
			var roomList = $("#box12 ul");
			roomList.html("");
			$(rep).each(function(idx, itm){
				var room = $("<li class='list-group-item' id='room"+ itm.id +"'>" +
						"<span class='badge'>"+ itm.number +"</span>" + itm.name + "</li>");
				room.data("idx", itm.id);
				roomList.append(room);
			});
		},
		onEnterRoom: function(rep){
			
			if(rep.state != D3.STATE.OK){
				console.log("error occur when enter room");
				return;
			}
			
			_main.showRoom(rep);
			/**
			 *  更新房间人数
			 */
			var room = JSON.parse(rep.info);
			$("#room" + room.id).find("span").html(room.number);
			/**
			 * 房间用户列表
			 */
			this.renderList(room.players);
		},
		onLeaveRoom: function(rep){
			/**
			 *  更新房间人数
			 */
			var room = JSON.parse(rep.info);
			$("#room" + room.id).find("span").html(room.number);
			/**
			 * 房间用户列表
			 */
			this.renderList(room.players);
		},
		renderList: function(list){
			var playerList = $("#d3-chat-player-list"),
				html = "";
			$(list).each(function(idx, itm){
				html += '<li class="list-group-item">'+ itm.name +'</li>';
			});
			
			playerList.html("");
			playerList.html(html);
		},
		onChat: function(rep){
			var name = rep.name,
				target = rep.target,
				info = rep.info;
			var box = $("#d3-chat-box");
			var chatItem = $('<div class="alert alert-success" role="alert">'+ name + ": "+ info +'</div>')
							.appendTo(box);
			box.scrollTop(
					chatItem.offset().top - box.offset().top + box.scrollTop()
				);
			$("#d3-chat-input textarea").focus();
		},
		bind: function(){
			var rooms = $(".d3-room-list ul li"),
				me = this;
			rooms.live("click", function() {
				var self = $(this);
				self.siblings().css({
					background : "#FFFFFF"
				});
				self.css({
					background : "#5BB75B"
				});
				me.roomIdx = self.data("idx");
			});
			
			var join = $("#box12").find(".next-step");
			join.click(function() {
				D3.event(D3.event.ENTER_ROOM_ASK, null, me.roomIdx);
				return false;
			});
			
			var sendBtn = $("#d3-chat-send"),
				chatInput = $("#d3-chat-input textarea");
			sendBtn.click(function(){
				var msg = chatInput.val();
				chatInput.val("");
				D3.event(D3.event.CHAT_ASK, null, msg);
			});
		}
	});
	D3.UI.Room = new Room();
	
}( window.D3 = window.D3 || {}));
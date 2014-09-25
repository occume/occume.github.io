(function (D3) {
	"use strict";
	
	D3.UI = {};
	
	var Statu = Class.create({
		init: function(){
			this.register();
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
		}
	});
	D3.UI.Main = new Main();
	
	var Room = Class.create({
		init: function(){
			this.register();
			this.bind();
		},
		register: function(){
			D3.event.on(D3.event.ROOM_LIST, this.showRooms.bind(this));
		},
		showRooms: function(rooms){
			
			var roomList = $("#room-list ul");
			roomList.html("");
			$(rooms).each(function(idx, itm){
				var room = $("<li>" + itm.name + "<span>["+ itm.number +"]</span></li>");
				room.data("idx", itm.id);
				roomList.append(room);
			});
		},
		offline: function(){
			this.main.scrollTo("#box11", 500);
		},
		bind: function(){
			var rooms = $("#room-list ul li"),
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
				D3.event(D3.event.ENTER_ROOM_RST);
				return false;
			});
		}
	});
	D3.UI.Room = new Room();
	
}( window.D3 = window.D3 || {}));
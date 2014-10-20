(function (D3) {
	"use strict";
	
	var Template = {
			getTemplate: function(){
				
			},
			fileInput: function(){
				var html = '<div class="form-group">' +
			    '<input type="file" name="file">' +
			    '<p class="help-block"></p>' +
			  '</div>';
			  return html;
			},
			fillTemplate: function(temp, data){
				return  temp.replace(/\\?\{([^{}]+)\}/g, function (match, name) {
			    	return (data[name] === undefined) ? '' : data[name];
			  	});
			}
		};
	
	D3.UI = {};
	
	var Statu = Class.create({
		init: function(){
			this.register();
			this.bind();
			this.messageBox = $("#d3_msg_box");
		},
		register: function(){
			D3.event.on(D3.event.ON_LINE, this.online);
			D3.event.on(D3.event.OFF_LINE, this.offline);
			D3.event.on(D3.event.ADD_FRIEND_REP, this.updateMessageBox.bind(this));
//			D3.event.on(D3.event.CHAT_2_ONE_REP, this.onChat2One.bind(this));
		},
		online: function(){
			$("#d3_state img").attr("src", "/client/img/green.png");
			$.scojs_message('This is an info message', $.scojs_message.TYPE_OK);
		},
		offline: function(){
			$("#d3_state img").attr("src", "/client/img/red.png");
		},
		updateMessageBox: function(rep){
//			if(rep.name == D3.session.user().name){
//				return;
//			}
//			if(rep.type == "ROOM" && _main.inScreen == _main.SCREEN.ROOM){
//				return;
//			}
//			if(rep.type == "ONE" && _main.inScreen == _main.SCREEN.DIALOG){
//				return;
//			}
			var msgBox = this.messageBox,
				msgCount = msgBox.find("#d3_msg_count"),
				count = parseInt(msgCount.html());
			msgCount.html(count + 1);
			
			var msgItem = msgBox.find("a");
//			msgItem.attr("data-content", "一个消息");
		},
		onChat2One: function(rep){
			
			var navbar = $("#navbar");
			navbar.append('<li id=""><a href="">'+ rep.name +'</a></li>');
		},
		bind: function(){
			
			$("#d3_room_chat").click(function(){
//				_main.showRoom();
				
				panel2.change2RoomChat();
			});
			
			$("#d3_hall").click(function(){
				_main.showHall();
			});
			
			$("#d3_one_chat").click(function(){
				panel2.change2OneChat();
			});
			
			$("#d3_show_main_panel").click(function(){
				$("#d3-main-panel").toggle();
			});
			
			$("#d3_look_up").click(function(){
				lookupPanel.toggle();
			});
			
			$("#d3_msg_box").click(function(){
				_messagePanel.toggle();
				$("#d3_msg_count").html(0);
			});
		}
	});
	D3.UI.Statu = new Statu();
	/**
	 * 用户信息列表
	 */
	var Panel1 = Class.create({
		init: function(){
			this.register();
			this.bind();
		},
		register: function(){
			D3.event.on(D3.event.ON_LINE, this.online);
		},
		online: function(){
			var user = D3.session.get(D3.Key.USER);
			$(".d3-user-name").html(user.name);
		},
		offline: function(){
			
		},
		bind: function(){
			
		}
	});
	var panel1 = D3.UI.Panel1 = new Panel1();
	/**
	 * 用户关系列表
	 */
	var Panel2 = Class.create({
		init: function(){
			this.register();
			this.bind();
		},
		register: function(){
			D3.event.on(D3.event.FRIEND_LIST_REP, this.onFriendList.bind(this));
		},
		onFriendList: function(rep){
//			console.log(rep);
			var relation = $(".d3-relation"),
				friendList = relation.find("#collapseOne .list-group"),
				html = "",
				list = JSON.parse(rep.info);
			$(list).each(function(idx, itm){
				html += '<a href="#" class="list-group-item active">'+ itm.name +'</a>';
			});
			
			friendList.html(html);
		},
		change2OneChat: function(){
			
			$(".d3-relation").show();
			$(".d3-one-chat-panel").show();
			
			$(".d3-room-list").hide();
			$(".d3-room-chat-panel").hide();
			
		},
		change2RoomChat: function(){
			
			$(".d3-relation").hide();
			$(".d3-one-chat-panel").hide();
			
			$(".d3-room-list").show();
			$(".d3-room-chat-panel").show();
			
		},
		bind: function(){
			$(document).delegate("#d3-relation-friend .list-group a", "click", function(){
				
			});
		}
	});
	var panel2 = D3.UI.Panel2 = new Panel2();
	/**
	 * 对话界面
	 */
	var Panel3 = Class.create({
		init: function(){
			this.register();
			this.bind();
		},
		register: function(){
			D3.event.on(D3.event.ON_LINE, this.online);
		},
		online: function(){
			var user = D3.session.get(D3.Key.USER);
			$(".d3-user-name").html(user.name);
		},
		offline: function(){
			
		},
		bind: function(){
			
		}
	});
	var panel3 = D3.UI.Panel3 = new Panel3();
	/**
	 * 查找层
	 */
	var LookupPanel = Class.create({
		init: function(){
			this.register();
			this.bind();
		},
		register: function(){
			D3.event.on(D3.event.LOOK_UP_USER_REP, this.onLookupUser.bind(this));
		},
		toggle: function(){
			$("#d3-look-up-panel").toggle();
		},
		onLookupUser: function(rep){
			var template = '<div class="col-sm-3"><div class="panel panel-primary ">' +
			      '<div class="panel-heading">' +
			        '<h3 class="panel-title">{name}</h3>' +
			      '</div>' +
			      '<div class="panel-body">' +
			        '<dl class="dl-horizontal">' +
					  '<dt>Email:</dt>' +
					  '<dd>{email}</dd>' +
					'</dl>' +
			        '<button type="button" class="btn btn-primary" data-name="{name}">加好友</button>' +
			      '</div>' +
			    '</div></div>';
			var list = JSON.parse(rep.info),
				html = "";
			if(list.length){
				$(list).each(function(idx, itm){
					html += Template.fillTemplate(template, itm);
				});
				$("#d3-look-up-one .d3-result").html(html);
			}
			else{
				
			}
		},
		bind: function(){
			/**
			 *  type:
			 *  	1 by name
			 *  	2 random
			 */
			$("#d3-look-up-one-btn").click(function(){
				var param = {
					type: "1",
					name: $("#d3-look-up-one-input").val(),
					target: "",
					info: ""
				};
				lookup(param);
			});
			$("#d3-look-up-one-random").click(function(){
				var param = {
					type: "2",
					name: "",
					target: "",
					info: ""
				};
				lookup(param);
			});
			
			function lookup(param){
				D3.event(D3.event.LOOK_UP_USER_ASK, null, param);
			}
			
			$(document).on("click", "#d3-look-up-one .panel .btn", function(){
				var 
					user = D3.session.get(D3.Key.USER),
					param = {
					type: "1",
					name: user.name,
					target: $(this).attr("data-name"),
					info: ""
				};
				D3.event(D3.event.ADD_FRIEND_ASK, null, param);
			});
			
		}
	});
	var lookupPanel = new LookupPanel();
	
	var MessagePanel = Class.create({
		init: function(){
			this.register();
			this.bind();
		},
		register: function(){
			D3.event.on(D3.event.ADD_FRIEND_REP, this.onAddFriend.bind(this));
		},
		toggle: function(){
			$("#d3-message-panel").toggle();
		},
		onAddFriend: function(rep){
			var template = '<div class="col-sm-3"><div class="panel panel-primary ">' +
			      '<div class="panel-heading">' +
			        '<h3 class="panel-title">好友请求</h3>' +
			      '</div>' +
			      '<div class="panel-body">' +
			        '<p>{name}请求加你为好友!</p>' +
			        '<button type="button" class="btn btn-primary" data-name="{name}">同意</button>' +
			      '</div>' +
			    '</div></div>';
			
			var html = Template.fillTemplate(template, rep);
			
			$("#d3-message-panel .d3-result").append(html);
		},
		bind: function(){
			$(document).on("click", "#d3-message-panel .panel .btn", function(){
				var 
					user = D3.session.get(D3.Key.USER),
					param = {
					type: "2",
					name: user.name,
					target: $(this).attr("data-name"),
					info: ""
				};
				D3.event(D3.event.ADD_FRIEND_ASK, null, param);
			});
		}
	});
	var _messagePanel = new MessagePanel();
	
	var Main = Class.create({
		init: function(){
			this.register();
			this.main = $("#wrapper1");
			this.inScreen = 1;
		},
		SCREEN: {
			LOGIN: 1,
			HALL: 2,
			ROOM: 3,
			DIALOG: 4
		},
		register: function(){
			D3.event.on(D3.event.ON_LINE, this.online.bind(this));
			D3.event.on(D3.event.OFF_LINE, this.offline.bind(this));
		},
		online: function(){
			this.showHall();
		},
		offline: function(){
			this.showLogin();
		},
		showLogin: function(){
			this.main.scrollTo("#box11", 500);
			this.inScreen = this.SCREEN.LOGIN;
		},
		showRoom: function(rep){
			this.main.scrollTo("#box13", 500);
			this.inScreen = this.SCREEN.ROOM;
		},
		showHall: function(rep){
			this.main.scrollTo("#box12", 500);
			this.inScreen = this.SCREEN.HALL;
		},
		showDialog: function(){
			this.main.scrollTo("#box14", 500);
			this.inScreen = this.SCREEN.DIALOG;
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
			D3.event.on(D3.event.CHAT_2_ROOM_REP, this.onChat2Room.bind(this));
			D3.event.on(D3.event.CHAT_2_ONE_REP, this.onChat2One.bind(this));
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
		onChat2Room: function(rep){
			if(_main.inScreen != _main.SCREEN.ROOM){
				return;
			}
			var name = rep.name,
				info = rep.info;
			var box = $("#box13 .d3-chat-box");
			var chatItem = $('<div class="alert alert-success" role="alert">'+ name + ": "+ info +'</div>')
							.appendTo(box);
			box.scrollTop(chatItem.offset().top - box.offset().top + box.scrollTop());
			$("#d3-chat-input textarea").focus();
		},
		onChat2One: function(rep){
			
			var tabs = $(".d3-one-chat-panel .nav-tabs"),
				tabContents = $(".d3-one-chat-panel .tab-content"),
				activeClass = '',
				myName = D3.session.user().name,
				target,
				html = "";
		
			if(!this.tabList){
				this.tabList = {};
				this.tabContentList = {};
				this.tabActive = !1;
				this.tabIndex = 1;
			}
			
			if(myName == rep.name){
				target = rep.target;
			}
			else{
				target = rep.name;
			}
//			console.log(target);
			var content = '<div class="d3-chat-item">' +
	        '<span class="d3-chat-item-title">'+ rep.name +'</span>'+ rep.info +'</div>';
			
			if(!this.tabList[target]){
//				this.tabList.push(target);
				console.log(this.tabList);
				if(!this.tabActive){
					activeClass = "active";
					this.tabActive = !0;
				}
				var id = this.tabIndex++,
					tabId = "one-tab-" + id,
					tabContentId = "on-tab-content-" + id;
				
				html = '<li class="'+ activeClass +'" id="'+ tabId +'"><a data-toggle="tab" role="tab" href="#'+ tabContentId +'">'+ target +'</a></li>';
				html = $(html);
				this.tabList[target] = html;
				tabs.append(html);
				html.siblings().removeClass("active");
				html.addClass("active");
				
				html = '<div id="'+ tabContentId +'" class="tab-pane fade '+ activeClass +' in d3-chat-box">'+ content +'</div>';
				html = $(html);
				this.tabContentList[target] = html;
				tabContents.append(html);
				html.siblings().removeClass("active");
				html.addClass("active");
			}
			else{
				var tabContent = this.tabContentList[target];
				tabContent.append(content);
			}
			
		},
		bind: function(){
			var rooms = $(".d3-room-list ul li"),
				me = this;
			$(document).on("click", "#box12 ul li", function() {
				
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
				D3.event(D3.event.CHAT_2_ROOM_ASK, null, msg);
			});
		}
	});
	D3.UI.Room = new Room();
	
	var Dialog = Class.create({
		init: function(){
			this.register();
			this.bind();
		},
		register: function(){
			
		},
		bind: function(){
			$(document).on("click", "#box14 ul li", function(){
				var me = $(this),
					target = me.children("a").attr("href");
				me.siblings().removeClass("active");
				me.addClass("active");
				
				var tab = $(target);
				tab.siblings().removeClass("active fade in");
				tab.addClass("active fade in");
				return false;
			});
		}
	});
	var _dialog = D3.UI.Dialog = new Dialog();
	
}( window.D3 = window.D3 || {}));
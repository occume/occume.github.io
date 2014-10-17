(function (D3) {
	"use strict";
	
	D3.User = {
		init: function(){
			D3.addProcessor(D3.Module.USER, D3.Module.User.LOOKUP,
			function(rep){
				/**
				 * 查找用户
				 */
				D3.event(D3.event.LOOK_UP_USER_REP, null, rep);
			});
			
			D3.addProcessor(D3.Module.USER, D3.Module.User.MESSAGE,
			function(rep){
				/**
				 * 好友请求
				 */
				D3.event(D3.event.ADD_FRIEND_REP, null, rep);
			});
			
			D3.addProcessor(D3.Module.USER, D3.Module.User.FRIEND_LIST,
			function(rep){
				/**
				 * 好友请求
				 */
				D3.event(D3.event.FRIEND_LIST_REP, null, rep);
			});
			
			this.register();
		},
		register: function(){
			/**
			 * 如果注册事件不能正确执行 检查 1.回调函数名称是否正确 2.注册中心是否存在该事件
			 */
			/**
			 * 查找用户
			 */
			D3.event.on(D3.event.LOOK_UP_USER_ASK, this.lookupUser.bind(this));
			D3.event.on(D3.event.ADD_FRIEND_ASK, this.addFriend.bind(this)); 
		},
		lookupUser: function(param){

			var ask = D3[D3.PROTOCOL].Packets.lookup(param);
			D3.session.send(ask);
		},
		addFriend: function(param){
			var ask = D3[D3.PROTOCOL].Packets.addFriend(param);
			D3.session.send(ask);
		}
	};
	
	D3.User.init();
	
}( window.D3 = window.D3 || {}));
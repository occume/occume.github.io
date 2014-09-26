(function (D3) {
	"use strict";
	
	D3.Login = {
		init: function(){
			this.register();
		},
		register: function(){
			D3.event.on(D3.event.DO_LOGIN, this.doLogin);
			D3.event.on(D3.event.ON_LOGIN, this.onLogin);
		},
		doLogin: function(){
			var 
				username = $("#username").val(),
				password = $("#password").val(),
				pkt = D3[D3.PROTOCOL].Packets.login({name: username, password: password}),
				user = D3.Storage.get(D3.Key.USER);
		
			if(user && user.online){
				console.log(user.name + " is online!");
				return false;
			}
			else if(user && user){
				
			}
			/**
			 * 处理 登录事件
			 */
			D3.addProcessor(D3.Module.LOGIN, D3.Module.Login.DFT,
			function(pkt){
				if(pkt.state = D3.STATE.OK){
					var user = {name: pkt.name, online: !0};
					D3.session.put(D3.Key.USER, user);
					D3.Storage.put(D3.Key.USER, user);
					/**
					 *  触发上线事件
					 */
					D3.event(D3.event.ON_LINE);
					D3.event(D3.event.ON_LOGIN);
				}
				else{
					console.log("errors occopy when login");
				}
			});
			
			D3.cid = jOne.createUUID();
			D3.cid = 39600;
			D3.session = D3.createSession("ws://127.0.0.1:10086/d3-server", null, function(){
		//	D3.session = D3.createSession("ws://112.124.115.136:10086/d3-server", null, function(){
				D3.session.send(pkt);
				D3.session.send(pkt);
			});
		},
		onLogin: function(){
//			/**
//			 * 登录成功，显示房间列表
//			 */
//			D3.addProcessor(D3.Module.LOGIN, D3.Module.Login.ROOMLIST,
//			function(pkt){
//				Room.init();
//				RoomList.showMe(pkt);
//			});
//			
//			D3.session.send(pkt);
		}
	};
	
	D3.Login.init();
}( window.D3 = window.D3 || {}));
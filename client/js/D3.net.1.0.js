(function (D3) {
	
	D3.Module = {
		LOGIN: 1,
		CHAT: 2
	};
	D3.Module.Login = {
		DFT: 1
	};
	
	D3.Module.Chat = {
		DFT: 1,
		ROOM_LIST: 2,
		ENTER_ROOM: 3,
		CHAT: 4
	};
	
	D3.STATE = {
		OK: "00"	
	};
	
	D3.Key = {
		USER: "user"
	};

	D3.processors = {};
	
	D3.addProcessor = function(act, act_min, processor){
		D3.processors[act + "_" + act_min] = processor;
	};
	
	D3.getProcessor = function(act, act_min){
		return D3.processors[act + "_" + act_min];
	};
	
    D3.Codecs = {};
    D3.Codecs.JSON = {
        encoder : {transform: function (e){ return JSON.stringify(e);}},
        decoder : {transform: function (e){
                        var evt = JSON.parse(e);
                        if((typeof evt.type !== 'undefined') && (evt.type === D3.NETWORK_MESSAGE)){
                            evt.type = D3.SESSION_MESSAGE;
                        }
                        return evt;
                    }
                  }
    };
    
    var Session = Class.create({
		init: function(url, config, callback){
			
			this.soket = _connect(url);
			this.state = 0;
			this.map = {};
			var me = this;
			
		    function _connect(url){
		    	
		    	var socket = new WebSocket(url);
		    	
		        if(D3.PROTOCOL = "PB")
		        	socket.binaryType = "arraybuffer";
		        socket.onopen = function() {
		            if (me.state === 0) {
		            	me.state = 1;
		            	if(callback)
		            		callback.apply();
		            } else if (me.state === 2) {
		            	socket.send(getReconnect(config));
		            } else {
		                var evt = D3.NEvent(D3.EXCEPTION,"Cannot reconnect when session state is: " + state);
		                me.onerror(evt);
		                dispatch(D3.EXCEPTION, evt);
		            }
		        };
		        
		        socket.onmessage = function (e) {
					
		            var resp = D3.Codecs[D3.PROTOCOL].decoder.transform(e.data);
		           console.log(resp);
		            if(!(resp.module && resp.cmd)){
		                throw new Error("error on response");
		            }
		            
		            var module = resp.module,
		            	cmd = resp.cmd,
		            	processor = D3.getProcessor(module, cmd);
		            
		            if(processor){
		            	processor(resp.data);
		            }
		            else{
		            	throw new Error("no such processor");
		            }

		        };

		        socket.onclose = function (e) {
		        	console.log("close");
		        	/**
		        	 * 断开连接 事件
		        	 */
		        	D3.event(D3.event.OFF_LINE);
		        	var user = D3.Storage.get("user");
		        	user.online = !1;
		        	D3.Storage.put("user", user);
		            state = 2;
		        };

		        socket.onerror = function (e) {
		            state = 2;
		        };
		        return socket;
		    };
		}
	});
    
	Session.addMethods({
		send: function (evt) {
            if(this.state !== 1){
               throw new Error("Session is not in connected state"); 
            }
			this.soket.send(evt);
        },
        put: function(key, value){
        	this.map[key] = value;
        },
        get: function(key){
        	return this.map[key];
        },
        close: function(){
        	this.soket.close();
        }
	});

    D3.createSession = function (url, config, callback) {
        return new Session(url, config, callback);
    };

    D3.reconnect = function (session, reconnectPolicy, callback) {
        reconnectPolicy(session, callback);
    };
    
    function Session1(url, config, callback) {
        var me = this;
       
        var message = getReqConnPacket();
        var ws = connectWebSocket(url);
        var state = 0;// 0=CONNECTING, 1=CONNECTED, 2=NOT CONNECTED, 3=CLOSED
        var loginState = 0;
        var reconnectKey;

//        function connectWebSocket(url) {
//            ws = new WebSocket(url);
//            if(D3.PROTOCOL = "PB")
//            	ws.binaryType = "arraybuffer";
//            ws.onopen = function() {
//                if (state === 0) {
////                    ws.send(message);
//                	state = 1;
//                	if(callback)
//                		callback.apply();
//                } else if (state === 2) {
//                    ws.send(getReconnect(config));
//                } else {
//                    var evt = D3.NEvent(D3.EXCEPTION,"Cannot reconnect when session state is: " + state);
//                    me.onerror(evt);
//                    dispatch(D3.EXCEPTION, evt);
//                }
//            };
//            
//            ws.onmessage = function (e) {
//				
//                var resp = D3.Codecs[D3.PROTOCOL].decoder.transform(e.data);
//               
//                if(!(resp.module && resp.cmd)){
//                    throw new Error("error on response");
//                }
//                
//                var module = resp.module,
//                	cmd = resp.cmd,
//                	processor = D3.getProcessor(module, cmd);
//                if(processor){
//                	processor(resp.data);
//                }
//                else{
//                	throw new Error("no such processor");
//                }
//
////                if(resp.act === D3.LOG_IN_FAILURE || resp.type === D3.ROOM_JOIN_FAILURE){
////                    ws.close();
////                }
////				if(resp.act === D3.LOG_IN_SUCCESS){
////					
////                    applyProtocol();
////                      
////					D3.playerId = evt.tuple;
////					loginState = 1;
////                    ws.send(D3.makePacketByType(D3.ROOM, D3.ROOM_LIST));
////                }
//            };
//
//            ws.onclose = function (e) {
//                state = 2;  
//                dispatch(D3.DISCONNECT, D3.makePacket(D3.DISCONNECT, e, me));
//            };
//
//            ws.onerror = function (e) {
//                state = 2;
//                dispatch(D3.EXCEPTION, D3.makePacket(D3.EXCEPTION, e, me));
//            };
//            return ws;
//        }

        me.onmessage = doNothing;
        me.onerror = doNothing;
        me.onclose = doNothing;

        me.onevent = function (evt) {
            dispatch(evt.type, evt);
        };
        me.on = me.onevent;// alias for onevent

        me.send = function (evt) {
            if(state !== 1){
               throw new Error("Session is not in connected state"); 
            }
            //ws.send( me.outCodecChain.transform(evt) ); // <= send JSON/Binary data to socket server
			ws.send(evt);
            return me; // chainable
        };
        
        me.onclose = function () {
			console.log("close");
            state = 3;
            ws.close();
            //dispatch(D3.CLOSED, D3.NEvent(D3.CLOSED));
        };
        
        me.disconnect = function () {
            state = 2;
            ws.close();
        };
        
        me.reconnect = function (callback) {
            if (state !== 2) {
                throw new Error("Session is not in not-connected state. Cannot reconnect now"); 
            }
            onStart = callback;
            ws = connectWebSocket(url);      
        };
        
        me.setState = function (newState) {state = newState;};
        
        function getLoginPacket(config) {
            return D3.Codecs.encoder.transform(D3.loginPacket(config));
        }

		function getReqConnPacket(config) {
            return D3.reqConnPacket();
        }
        
        function getReconnect(config) {
            if (typeof reconnectKey === 'undefined') throw new Error("Session does not have reconnect key");
            var loginEncoder = (typeof config.loginEncoder === 'undefined') ? D3.Codecs.encoder : config.loginEncoder;
            return loginEncoder.transform(D3.NEvent(D3.RECONNECT, reconnectKey));
        }
        
        function applyProtocol(config) {
            ws.onmessage = protocol;
        }
        
        function protocol(e) {
            var pkt = D3.Codecs[D3.PROTOCOL].decoder.transform(e.data);
            console.log(pkt);
            dispatch(pkt);
        }
        
        function dispatch(pkt) {
            if (typeof pkt.target === 'undefined') {
            	pkt.target = me;
            }
            if (pkt.act === D3.CLOSED){
                me.onclose(pkt);
            }
            
            var processor = D3.getProcessor(pkt.act, pkt.act_min);
            if(processor){
            	processor(pkt);
            }
            else{
            	throw new Error("no such processor");
            }
        }
        
        function doNothing(pkt) {}
    }

    D3.ReconnetPolicies = {
        noReconnect : function (session, callback) { session.close();} ,
        reconnectOnce : function (session, callback) {
            session.reconnect(callback);
        }
    };

    function removeFromArray(chain, func) {
        if(chain instanceof Array){
            var index = chain.indexOf(func);
            while(index !== -1){
                chain.splice(index,1);
                index = chain.indexOf(func);
            }
        }
    }

}( window.D3 = window.D3 || {}));
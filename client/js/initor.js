;
(function() {

	var jOneUtil = {
		/**
		 * 数组包含函数
		 */
		ArrayContains : function(arr, elem) {
			var len = arr.length, i = 0;
			for (; i < len; i++) {
				if (arr[i] === elem) {
					return true;
				}
			}
			return false;
		},
		/**
		 * 函数中提取html字符串
		 */
		funHtml : function(fn) {
			/**
			 * %20 空格 %0D 换行 %0A 回车 %09 制表
			 */
			var origHtml = fn.toString(), removeOut = /.*{\/(.*)\/}/;
			var html = origHtml.match(removeOut),
			/**
			 * 替换所有 空格， 回车， 换行， 制表
			 */
			htmlNoGap = encodeURIComponent(origHtml).replace(/(%0D|%0A|%09)/g,
					""),
			/**
			 * 还原
			 */
			html2 = decodeURIComponent(htmlNoGap),
			/**
			 * 去除函数格式
			 */
			html3 = html2.match(removeOut)[1],
			/**
			 * 最终html字符串
			 */
			ret = html3.replace(/\*/g, "");
			return ret;
		},
		offset : function(elem) {

			if (!elem)
				return {
					left : 0,
					top : 0
				};
			var top = 0, left = 0;
			if ("getBoundingClientRect" in document.documentElement) {
				// jquery方法
				var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement, clientTop = docElem.clientTop
						|| body.clientTop || 0, clientLeft = docElem.clientLeft
						|| body.clientLeft || 0, top = box.top
						+ (self.pageYOffset || docElem && docElem.scrollTop || body.scrollTop)
						- clientTop, left = box.left
						+ (self.pageXOffset || docElem && docElem.scrollLeft || body.scrollLeft)
						- clientLeft;
			} else {
				do {
					top += elem.offsetTop || 0;
					left += elem.offsetLeft || 0;
					elem = elem.offsetParent;
				} while (elem);
			}
			return {
				left : left,
				top : top
			};
		}
	};

	window.jOneUtil = jOneUtil;

	var pipeline = function() {
		var valves = [], currIndex = 0;

		return {
			add : function(fn) {
				valves.push(fn);
			},
			next : function() {
				if (currIndex < valves.length) {
					valves[currIndex++].apply();
				}
			},
			run : function() {
				valves[currIndex++].apply();
			}
		};
	};

	window.pipeline = pipeline;
})();
$(function() {
	/**
	 * 
	 * 
	 */
	var bodyWidth = $(document.body).width(), 
		boxes = $(".box"), 
		box11 = $("#box11"), 
		box12 = $("#box12"), 
		box13 = $("#box13"), 
		box14 = $("#box14"), 
		menu = $("#menu"), 
		loginRow = $("#box11 .row"), 
		loginForm = loginRow.find(".login-form"), 
		slideWrapper = $("#wrapper1");

	var Loading = {
		init : function() {
			var me = this;
			var mgLeft = (bodyWidth - menu.width()) / 2;
			menu.css({
				marginLeft : mgLeft - 20
			});

			var paper = Raphael("paper1", 1200, 600);
			this.pathCircle = "M100,5  a69,69 0 1,1 -1,0 z";
			this.pathRect = "M10 10h400v200h-400z";

			paper.text(0, 0, "NBXX").attr({
				fill : "#FAA732",
				"font-size" : 120
			}).transform("t400,200");

			$(paper.canvas).css({
				top : 0,
				left : 0
			});

			this.baseProgress = paper.path("M100,5 a100,100 0 1,1 -1,0 z")
					.attr({
						stroke : "#fff",
						"stroke-width" : 5
					}).transform("t700,100");

			paper.customAttributes.along = function(a) {
				return {
					path : me.baseProgress.getSubpath(0, a
							* me.baseProgress.getTotalLength())
				};
			};

			this.loadingProgress = paper.path(0, 0, 100, 100).attr({
				along : 0,
				stroke : "#FAA732",
				"stroke-dasharray" : "--",
				"stroke-width" : 1
			});
			this.percent = paper.text(0, 0, "0%").attr({
				fill : "#FAA732",
				"font-size" : 80
			}).transform("t800,200");

		},
		progress : function(digit) {
			this.loadingProgress.transform("t700,100").attr({
				along : digit
			});
			this.percent.transform("t800,200").attr({
				text : (digit * 100).toFixed(0) + "%"
			});
		},
		loading : function() {

			var me = this;

			var queue = pipeline();

			queue.add(function() {
				setTimeout(function() {
					me.loadingProgress.transform("t700,100").stop().animate({
						along : 0.2
					}, 3000, function() {
						me.baseProgress.hide();
						queue.next();
					});
				}, 1000);
			});

			queue.add(function() {
				me.onLoadingOver();
				
			});

			queue.run();

		},
		loadingOver : function() {
			var me = this;
			setTimeout(function() {
				me.loadingProgress.animate({
					path : me.pathRect,
					transform : "t600,100"
				}, 400);
			}, 200);
			me.percent.remove();
			me.baseProgress.remove();
			loginRow.animate({
				marginLeft : ""
			}, function() {
				loginForm.show();
			});
		}
	};
	
	var Loader = {
		onLoaded: function(callback){
			this.callback = callback;
			return this;
		},
		loadResp: function(){
			
			var me = this;
			var manifest = [
//			    {src:"img/btn.png", id:"btn"},
//			    {src:"img/bullet.png", id:"bullet"},
//			    {src:"img/enemy.png", id:"enemy"},
//			    {src:"img/tower.png", id:"tower"},
				{src:"js/lib/jOne.js", id:"jOne-js"},
				
				{src:"js/lib/underscore.js", id:"underscore-js"},
				{src:"js/lib/backbone.js", id:"backbone-js"},
				{src:"js/lib/two.min.js", id:"two-js"},
				
			    {src:"js/D3.net.1.0.js", id:"D3-net-js"},
			    {src:"js/D3.event.1.0.js", id:"D3-event-js"},
			    {src:"js/D3.storage.1.0.js", id:"D3-storage-js"},
			    {src:"js/D3.net.packet.1.0.js", id:"D3-net-packet-js"},
			    {src:"js/lib/jquery.localscroll-1.2.7-min.js", id:"localscroll-js"},
			    {src:"js/lib/nbw-parallax.js", id:"nbw-parallax-js"},
			    {src:"js/lib/scrollTo.js", id:"scrollTo-js"},
			    
			    {src:"js/lib/ByteBufferAB.min.js", id:"ByteBufferAB-js"},
			    {src:"js/lib/Long.js", id:"long-js"},
			    {src:"js/lib/ProtoBuf.min.js", id:"protobuf-min-js"},
			    {src:"js/D3.net.protobuf.1.0.js", id:"D3-net-protobuf-js"},
			    {src:"js/D3.ui.1.0.js", id:"D3-ui-js"},
			    {src:"js/D3.login.1.0.js", id:"D3-login-js"},
			    {src:"js/D3.chat.1.0.js", id:"D3-chat-js"},
			    {src:"js/D3.user.1.0.js", id:"D3-user-js"},
			    {src:"js/D3.sbox.1.0.js", id:"D3-sbox-js"},
			    {src:"js/D3.raphael.1.0.js", id:"D3-raphael-js"},
			    {src:"js/D3.monster.1.0.js", id:"D3-monster-js"},
			    {src:"js/D3.turret.1.0.js", id:"D3-turret-js"},
			    {src:"js/D3.shell.1.0.js", id:"D3-shell-js"},
			    {src:"js/D3.map.1.0.js", id:"D3-map-js"},
			    {src:"js/D3.info.1.0.js", id:"D3-info-js"},
			    {src:"js/D3.player.1.0.js", id:"D3-player-js"},
			    {src:"js/D3.game.1.0.js", id:"D3-game-js"}
			];

			var respLength = manifest.length, loaded = 0;

			loader = new createjs.LoadQueue(false);
			loader.on("fileload", handleFileLoad);
			loader.on("complete", handleComplete);
			loader.loadManifest(manifest);

			function handleFileLoad(file) {
				loaded++;
				var digit = (loaded / respLength).toFixed(2);
				Loading.progress(digit);
//				console.log(digit);
			}

			function handleComplete() {
				Loading.loadingOver();
				if(me.callback)
					me.callback.call();
			}
		}	
	};
					/**
					 * 开始游戏
					 */
//						D3.Game.start();
					/**
					 * 出怪
					 */
//						D3.Monster.create(0, 50, pkt.tuple.id);

	var Game = {
		init : function() {
			
			Loading.init();
			
			Loader.onLoaded(function(){
				console.log("资源加载完毕");
//				slideWrapper.scrollTo("#box14", 500);
				if(!D3.session){
					D3.event(D3.event.OFF_LINE);
				}
				D3.PROTOCOL = "PB";
//				D3.PROTOCOL = "JSON";
				Messenger().post("Your request has succeded!");
//				init2();
			}).loadResp();
			
			function init2(){
				var two = new Two({
			        fullscreen: true,
			        autostart: true
			      }).appendTo(document.body);
			      var rect = two.makeRectangle(two.width / 2, two.height / 2, 50 ,50);
			      two.bind('update', function() {
			        rect.rotation += 0.001;
			      });
			}
			
			this.bind();
		},
		bind : function() {
			var me = this;

//			$(document).delegate('a.link', 'click', function() {

			/**
			 * 登录按钮
			 */
			$("#login-btn").click(function() {
				D3.event(D3.event.DO_LOGIN);
				return false;
			});

		}
	};
	
	Game.init();
});
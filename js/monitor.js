;
(function(){
	
	var jOneUtil = {
		/**
		 * 数组包含函数
		 */
		ArrayContains: function(arr, elem){
			var len = arr.length,
				i = 0;
			for(; i < len; i++){
				if(arr[i] === elem){
					return true;
				}
			}
			return false;
		},
		/**
		 * 函数中提取html字符串
		 */
		funHtml: function(fn){
			/**
			 * %20 空格
			 * %0D 换行
			 * %0A 回车
			 * %09 制表
			 */
			var origHtml = fn.toString(),
			removeOut = /.*{\/(.*)\/}/;
			var html = origHtml.match(removeOut),
				/**
				 * 替换所有 空格， 回车， 换行， 制表
				 */
				htmlNoGap = encodeURIComponent(origHtml).replace(/(%0D|%0A|%09)/g, ""),
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
		}
	};
	
	window.jOneUtil = jOneUtil;
	
	var pipeline = function(){
		var valves = [],
			currIndex = 0;
		
		return {
			add: function(fn){
				valves.push(fn);
			},
			next: function(){
				if(currIndex < valves.length){
					valves[currIndex++].apply();
				}
			},
			run: function(){
				valves[currIndex++].apply();
			}
		};
	};
	
	window.pipeline = pipeline;
})()
;
$(function(){
	/**
	 * 数据监控小窗口布局
	 */
	var divider = function(params){
		var tileType = [1, 1 * 2, 1 * 2, 1 * 2 * 4 * 8],
		rand = Math.random,
		sizePerTime = 50,
		colSize = 10,
		tileUsed = [],
		currColor = 0,
		currDataIdx = 0,
		container = params.container,
		currBoxIdx = params.currBoxIdx,
		tileData = params.tileData,
		margin = 10;
		
		var monitorUtil = {
				getRandom: function(start, end){
					return (rand() * end + start) >> 0;
				}	
			};
			
			var monitorCONS = function(){
//				var bodyWidth = $(document.body).width(),
				var bodyWidth = container.width(),
					tileCol = colSize,
					tileWidth = bodyWidth / colSize,
					tileHeight = tileWidth; 
				return {
					rand: Math.random,
					tileWidth: tileWidth,
					tileHeight: tileHeight,
					//		        info       success	warning	   danger     
//					tileColors :[ "#D9EDF7", "#DFF0D8", "#FCF8E3", "#F2DEDE"]
					tileColors :[ "#FFFFFF", "#f1f1f1", "#FFFFFF", "#f1f1f1"]
				}
			}();
		
		return {
			makeTileType: function(){
				var ret = [], 
					i = 0, 
					tileTypeLen = tileType.length,
					size = sizePerTime;
				while(size--){
					ret.push(monitorUtil.getRandom(0, tileTypeLen));
				}
				return ret;
			},
			makeTile: function(){
				var tileTypes = this.makeTileType(),
					tiles = [],
					i = 0,
					size = sizePerTime,
					tile,
					pos;
				for(; i < size; i++){
					tile = tileType[ tileTypes[i] ];
					pos = this.findPos(tile);
					var div = this.makeDiv(tile, i);
					tiles.push(div);
					div.css({
						top: pos.top * monitorCONS.tileHeight,
						left: pos.left * monitorCONS.tileWidth
					});
					container.append(div);
				}
				return tiles;
			},
			findPos: function(tileType){
				var i = 0, 
					j = 0;
	
				while(true){
					for(; j < colSize; j++){
						//jOneUtil.ArrayContains(tileUsed, j + "_" + i);
						if(!jOneUtil.ArrayContains(tileUsed, j + "_" + i)){
							if(!this.collise(tileType, j, i)){
								return {left: j, top: i}
							}
						}
					}
					j = 0;
					i++;
				}
			},
			makeDiv: function(tileType, idx){
				var	color = monitorCONS.tileColors[currColor],
				
				content = "",
				dataItem;
				
				var out = $("<div></div>").css({
						position: "absolute",
						opacity: 1,
						background: color
					}),
					inner = $("<div style='border: 1px solid #cccccc'></div>").css({
						margin: "0 auto",
						position: "absolute"
					});
	//				rand = navUtil.getRandom(0, navCONS.tileColors.length),
					currColor++;
					(currColor == 4) && (currColor = 0);
				
				inner.css({
					bottom: margin,
					top: margin,
					left: margin,
					right: margin,
					padding: 10
				});
//				if(idx % 9 == 0 || (idx + 1) % 9 == 0){
//				
//				}else{
					if(currDataIdx < tileData.length){
						dataItem = tileData[currDataIdx++];
						inner.attr({id: dataItem.id + currBoxIdx}).css({
							lineHeight: "100px"
						});
//						console.log(dataItem);
						content = $("<div><a target='_blank' href='"+ dataItem.href +"'>" +
										"<span style='font-size: 18px;' class='label label-info'>"+ dataItem.title +"</span></a></div>" +
									    "<p>" + dataItem.desc + "</p>")
									.css({
										lineHeight: "30px"
									});
					}
//				}
				
				inner.append(content);
				out.append(inner);
				var cons = monitorCONS,
					sty;
				switch(tileType){
					case 64:
						sty = {
							width: cons.tileWidth * 2,
							height: cons.tileHeight * 2
						};
						break;
					case 4:
						sty = {
							width: cons.tileWidth,
							height: cons.tileHeight * 2
						};
						break;
					case 2:
						sty = {
							width: cons.tileWidth * 2,
							height: cons.tileHeight
						};
						break;
					case 1:
						sty = {
							width: cons.tileWidth,
							height: cons.tileHeight
						};
				}
				return out.css(sty);
			},
			collise: function(tileType, x, y){
				var ret;
				switch(tileType){
					case 64:
						if((x + 1) >= colSize) return true;
						ret = jOneUtil.ArrayContains(tileUsed, ((x + 1) + "_" + y)) || jOneUtil.ArrayContains(tileUsed, x + "_" + (y + 1));
						if(!ret){
							tileUsed.push(x + "_" + y);
							tileUsed.push((x + 1) + "_" + y);
							tileUsed.push(x + "_" + (y + 1));
							tileUsed.push((x + 1) + "_" + (y + 1));
						}
						break;
					case 4:
						ret = jOneUtil.ArrayContains(tileUsed, x + "_" + (y + 1));
						if(!ret){
							tileUsed.push(x + "_" + y);
							tileUsed.push(x + "_" + (y + 1));
						}
						break;
					case 2:
						if((x + 1) >= colSize) return true;
						ret = jOneUtil.ArrayContains(tileUsed, (x + 1) + "_" + y);
						if(!ret){
							tileUsed.push(x + "_" + y);
							tileUsed.push((x + 1) + "_" + y);
						}
						break;
					case 1:
						ret = false;
						tileUsed.push(x + "_" + y);
						
				}
				return ret;
			}
		};
	};
	
	window.divider = divider;
});
//	divider({container: $("#container")}).makeTile();
$(function(){
	/**
	 * 首页布局
	 * 
	 */
	var navsData = [
					{title: 'music', clas: '_music_', id: 'jone_music'},
					{title: '我是谁', clas: '_whoami_'},
					{title: '他山之石', clas: '_othermountain_'},
					{title: "Home", clas: '_home_'}
					]; 
	
	var launchMonitor = function(){
		var container = $("#monitor"),
			navitor = $(".navitor"),
			navMenu = navitor.find("#menu"),
			conWidth = container.width(),
			monitorBoxs = [],
			i = 0;
		var template = {
			monitorBox : '<li id="##id##" class="box ##clas##">' +
							'<div class="content"><div class="inner"></div></div>' +
						 '</li>',
			navitorBox:  '<li class="navitorBox" id="##id##"><a href="##href##" class="link normal nav##clas##">##title##</a></li>',
			dividerVertical: '<li class="divider-vertical"></li>'
		};
		
		var containerIndex = container.attr("data-index"),
			_id,
			monitorTpl,
			menuTpl,
			box,
			menu;
		
		for(; i < navsData.length; i++){
			if(navsData[i].title != 'music'){
				_id = ["box", containerIndex, "", i + 1].join("");
				monitorTpl = template.monitorBox.replace("##id##", _id).replace("##clas##", navsData[i].clas);
				box = $(monitorTpl);
				container.append(box);
				box = box.find(".inner");
				
				box.css({
					width: $(document.body).width(),
					height: Math.max($("#home").height(), $(window).height())
				});
			}
			//monitorBoxs.push( divider({container: box, currBoxIdx: i + 1}).makeTile() );
			
			menuTpl = template.navitorBox.replace("##id##", navsData[i].id || '').replace("##href##", "#" + _id).replace("##clas##", navsData[i].clas).replace("##title##", navsData[i].title);
//			console.log(navMenu);
			menu = $(menuTpl);
			navMenu.append(menu);
			navMenu.append(template.dividerVertical);
		}
		/**
		*	if 首页 show whoAmI
		*/
		//if(document.title != '西瓦羊刀 - 博客园')
			$('#wrapper1').scrollTo("#box14", 500);
		
		
		setTimeout(function(){
			//console.log("home height = " + $("#home").height());
			$(".box .inner").css({
				height: $("#home").height()
			});
		}, 1000);
		
//		_navitor = $("#_navitor_");
//		$(document).scroll(function(){
//			var winHeight = $(window).height(),
//				docHeight = $(document).height(),
//				scrollTop = $(document).scrollTop();
//			if(scrollTop - (docHeight - winHeight) <= 1){
//				_navitor.animate({bottom: -100});
//			}
//		});
		
		/**
		*	博客园首页添加到 home标签页
		*/
		var home = $("#home");
		$("._home_").find(".inner").append(home);
		
		$(".navbar-inner").css({
			backgroundImage: "none"
		});

		return monitorBoxs;
	};
	var monitorBox = launchMonitor();
});
/**
*
*  播放器
*/
$(document).ready(function(){

	var imgBaseURL = "http://zhujis.com/img.php?",
		mp3BaseURL = "http://zhujis.com/mp3.php?";

	var playerUI = function(){
		var music = $("#jone_music");
		music.html("").css({
			padding: "10px 10px 5px 10px"
		});

		var attrPointer = {cursor: "pointer"};

		var paper = Raphael("jone_music", 62, 62),
			mBgr = paper.image('http://occume.github.io/cnblogs/images/bgr1.png', 0, 0, 60, 60);
		var baseProgress = paper.path("m30.5,3 a27,27 0 1,1 -1,0 z").attr({
				stroke: "#999",
				"stroke-width": 8,
				"stroke-linecap": "round",
				"stroke-linejoin": "round",
				"opacity": 0
			});
		//var to = 1;

		paper.customAttributes.along = function (a) {
			return {
				path: baseProgress.getSubpath(0, a * baseProgress.getTotalLength())
			};
		};
		var dloadProgress = paper.path(0, 0, 100, 100).attr({
				along: 0,
				stroke: "#c3c3c3",
				"stroke-width": 6
			}),
			playProgress = paper.path(0, 0, 100, 100).attr({
				along: 0,
				stroke: "#49AFCD",
				"stroke-width": 6
			});
			
		var play1 = paper.image('http://occume.github.io/cnblogs/images/play1.png', 23, 20, 16, 20).attr(attrPointer),
			pause1 = paper.image('http://occume.github.io/cnblogs/images/pause1.png', 23, 20, 16, 20).hide().attr(attrPointer);

		var onPlay,
			onPause,
			_duration,
			_state,
			_canplay = false;

		play1.click(function(){
			if(!_canplay) return;
			_state = 0;
			this.hide();
			pause1.show();
			onPlay.apply();
			//console.log("dura = " + _duration);
			playProgress.stop().animate({
				along: 1
			}, _duration);
				//to = +!to;
		});

		play1.mousedown(function(){
			this.transform("t1,1");
		});

		play1.mouseup(function(){
			this.transform("t-1,-1");
		});

		pause1.mousedown(function(){
			this.transform("t1,1");
		});

		pause1.mouseup(function(){
			this.transform("t-1,-1");
		});

		pause1.click(function(){
			_state = 1;
			this.hide();
			play1.show();
			onPause.apply();
			playProgress.stop();
		});

		return {
			dloadStart1: function(){
				dloadProgress.stop().animate({
					along: 1
				}, 10000);
			},
			dloadStart2: function(duration){
				dloadProgress.stop().animate({
					along: 1
				}, duration);
			},
			reset: function(){
				dloadProgress.attr({along: 0});
				playProgress.stop().attr({along: 0});
				this.changeMusic();
			},
			setOnPlay: function(fn){
				onPlay = fn;
			},
			setOnPause: function(fn){
				onPause = fn;
			},
			setDuration: function(duration){
				_duration = duration;
			},
			changeMusic: function(){
				play1.show();
				pause1.hide();
			},
			setCanplay: function(flag){
				_canplay = flag;
			}
		};
		
	}();
	
	//var bbox = c1.getBBox();

		//console.log(c1.getSubPath(0, 10));
	// Local copy of jQuery selectors, for performance.

	var player = function(){
		var	my_jPlayer = $("#jquery_jplayer"),
		my_trackName = $("#jp_container .track-name"),
		my_playState = $("#jp_container .play-state"),
		my_extraPlayInfo = $("#jp_container .extra-play-info");

		// Some options
		var	opt_play_first = false, // If true, will attempt to auto-play the default track on page loads. No effect on mobile devices, like iOS.
			opt_auto_play = true, // If true, when a track is selected, it will auto-play.
			opt_text_playing = "Now playing", // Text when playing
			opt_text_selected = "Track selected"; // Text when not playing

		// A flag to capture the first track
		var first_track = true;

		// Change the time format
		$.jPlayer.timeFormat.padMin = false;
		$.jPlayer.timeFormat.padSec = false;
		//$.jPlayer.timeFormat.sepMin = " min ";
		//$.jPlayer.timeFormat.sepSec = " sec";

		// Initialize the play state text
		my_playState.text(opt_text_selected);

		// Instance jPlayer

		var loadStart = 0,
			loadEnd = 0,
			loadDuration = 0;
		my_jPlayer.jPlayer({
			ready: function () {
				//$("#jp_container .track-default").click();
				my_jPlayer.jPlayer("setMedia", {
					mp3: mp3BaseURL + "shareid=1723151651&uk=704776812"
				});
				playerUI.dloadStart1();
				playerUI.setOnPlay(function(){
					my_jPlayer.jPlayer("play");
				});
				playerUI.setOnPause(function(){
					my_jPlayer.jPlayer("pause");
				});
			},
			timeupdate: function(event) {
				//console.log($.jPlayer.event.loadeddata);
				my_extraPlayInfo.text(parseInt(event.jPlayer.status.currentPercentAbsolute, 10) + "%");
			},
			play: function(event) {
				my_playState.text(opt_text_playing);
			},
			pause: function(event) {
				my_playState.text(opt_text_selected);
			},
			ended: function(event) {
				playerUI.reset();
			},
			loadstart : function(){
				loadStart = +new Date();
			},
			canplay: function(event){
				loadEnd = +new Date();
				loadDuration = loadEnd - loadStart;
				playerUI.dloadStart2(loadDuration);
				playerUI.setDuration(event.jPlayer.status.duration * 1000);
				playerUI.setCanplay(true);
				//console.log(event.jPlayer.status.duration * 1000);
			},
			progress: function(){
				//console.log(555555555555);
			},
			swfPath: "js",
			cssSelectorAncestor: "#jp_container",
			supplied: "mp3",
			wmode: "window"
		});

		// Create click handlers for the different tracks
		$("#jp_container .track").click(function(e) {
			playerUI.reset();
			playerUI.setCanplay(false);
			my_trackName.text($(this).text());
			my_jPlayer.jPlayer("setMedia", {
				mp3: $(this).attr("href")
			});
			if((opt_play_first && first_track) || (opt_auto_play && !first_track)) {
				//my_jPlayer.jPlayer("play");
			}
			first_track = false;
			$(this).blur();
			return false;
		});

	}();
});

$(function(){
	
	var home = $("._home_").find(".inner");
	var content = $("<div id='_home_'></div>").css({
//		border: "1px solid black",
		width: 800,
		height: 80,
		margin: "-15px 0 0 195px"
	})
	.appendTo(home);
	
	Raphael.el.putToSet = function (set) {
    	set.push(this);
        return this;
    };
    //
    var navigator = $("#navigator");
    navigator.html("").append(content);
    
	var paper = Raphael("_home_", 800, 80);
	var c = paper.path("m10,70l80,0 0,-50 120,0 0,50 120,0 0,-50 120,0 0,50 120,0 0,-50 120,0 0,50 80,0"),
		//c1= paper.path("m100,200l100,0 0,-70 150,0 0,70 150,0 0,-70 150,0 0,70 150,0 0,-70 150,0 0,70 100,0"),
		totalLength = c.getTotalLength(),
		subLen = 220;
	//c1.hide();
	c.attr({opacity: 0, "stroke-width": 1, stroke: "#CCCCCC",});
	
	paper.customAttributes.along = function (a) {
		var ret = {path: c.getSubpath(a * totalLength - subLen, a * totalLength)};

		if(a * totalLength <= subLen){
			ret = {path: c.getSubpath(0, a * totalLength)};
		}else if(a * totalLength > subLen && a * totalLength < (totalLength - subLen)){
			ret = {path: c.getSubpath(a * totalLength, a * totalLength + subLen)};
		}else if(a * totalLength >= (totalLength - subLen)){
			if(a == 1) return {path: c.getSubpath(a * totalLength - 0.1, totalLength)};
			ret = {path: c.getSubpath(a * totalLength, totalLength)};
		}
			
		return ret;
	};
	paper.customAttributes.along1 = function (a) {
		return {
			path: c.getSubpath(a * totalLength, a * totalLength + 220)
		};
	};
	
	var cc = paper.path(0, 0, 100, 100).attr({
		along: 0,
		stroke: "red",
		"stroke-width": 1
	}),
	ccc = paper.path().attr({
		along1: 0,
		stroke: "red",
		"stroke-width": 1
	}).hide();
	
	function getRect(bbox){
		var xinc = 15,
			yinc = 5;
		return {
	        x: bbox.x - xinc,
	        y: bbox.y - yinc,
	        x2: bbox.x2 + xinc,
	        y2: bbox.y2 + yinc,
	        width: bbox.width + xinc * 2,
	        height: bbox.height + yinc * 2
	    };
	}
	
	var navBackSet = paper.set(),
		navSet = paper.set(),
		navTop = 45,
		navLeft = 30;
	var navAttr = {"font-size": 20, opacity: 0, "font-family": '"Helvetica Neue",Helvetica,Arial,"Microsoft Yahei UI","Microsoft YaHei",SimHei,"宋体",simsun,sans-serif'},
		backAttr = { fill: "#999999", "fill-opacity": 0.1, stroke: "none", opacity: 0, cursor: "pointer",  target: "blank"},
		nav1 = paper.text(150, navTop, "首页").attr(navAttr).putToSet(navSet),
		nav1Back = paper.rect().attr(getRect(nav1.getBBox())).attr(backAttr).putToSet(navBackSet)
					.attr({href: "http://www.cnblogs.com/occume"}),
		nav2 = paper.text(270, navTop, "博问").attr(navAttr).putToSet(navSet),
		nav2Back = paper.rect().attr(getRect(nav2.getBBox())).attr(backAttr).putToSet(navBackSet),
		nav3 = paper.text(390, navTop, "闪存").attr(navAttr).putToSet(navSet),
		nav3Back = paper.rect().attr(getRect(nav3.getBBox())).attr(backAttr).putToSet(navBackSet),
		nav4 = paper.text(510, navTop, "管理").attr(navAttr).putToSet(navSet),
		nav4Back = paper.rect().attr(getRect(nav4.getBBox())).attr(backAttr).putToSet(navBackSet)
					.attr({href: "http://www.cnblogs.com/occume/admin/EditPosts.aspx"}),
		nav5 = paper.text(630, navTop, "其它").attr(navAttr).putToSet(navSet),
		nav5Back = paper.rect().attr(getRect(nav5.getBBox())).attr(backAttr).putToSet(navBackSet);
	
	var i = 0, len = navBackSet.length, _pos = 80;
	for(; i < len; i++){
//		console.log(navSet[i]);
		(function(_i){
//			console.log(navBackSet[_i]);
			navBackSet[_i].mouseover(function(){
				ccc.show();
				ccc.stop().animate({
					along1: (_pos + _i * 170) / totalLength
				}, 300, ">");
			});
		})(i);
		
	}
//	console.log(navSet[0]);
	function showNav(){
		
		var i = 0, len = navBackSet.length, duration = 100;
		
		for(; i < len; i++){
			(function(_i){
				setTimeout(function(){
					navSet[_i].animate({opacity: 1}, 200);
					navBackSet[_i].animate({opacity: 1}, 200);
				}, duration * i);
			})(i);
		}
	}
	
//	nav1Back.mouseover(function(){
//		ccc.show();
//		ccc.stop().animate({
//			along1: 80 / totalLength
//		}, 500, ">");
//	});
//	
//	nav2Back.mouseover(function(){
//		ccc.show();
//		ccc.stop().animate({
//			along1: 250 / totalLength
//		}, 500, ">");
//	});
	
	
	var queue = pipeline();
	
	queue.add(function(){
		cc.stop().animate({
			along: 1
		}, 2000, ">", function(){
			cc.attr({along: 0});
			queue.next();
		});
	});
	
	queue.add(function(){
		c.animate({opacity: 1}, 1000, function(){
			queue.next();
		});
	});
	
	queue.add(showNav);
	//$(document).click(function(){
		queue.run();
	//});
	
});

/**
*
*  who am i 布局
*/
$(document).ready(function(){
	
	function who_am_i_html(){
		/**
		 * <div id="who_am_i" style="margin: 100px;">
		 * <img src="http://images.cnblogs.com/cnblogs_com/occume/452569/o_logo.png" style="display: inline-block;">
		 * 
		 * 
		 * <div style="display: inline-block;vertical-align:top;margin-left: 20px;_zoom:1;_display:inline;">
		 * <div class="page-header" style="border: 0; margin: -10px 0;">
		 *    	<blockquote>		
		 * 			<h3>子夏问：“巧笑倩兮，美目盼兮，素以为绚兮”，何谓也</h1>
		 * 		</blockquote>
		 * 	  	<blockquote>
		 * 			<h3>子曰：“绘事后素”</h1>
		 * 		</blockquote>
		 * 	  	<blockquote>
		 * 			<h3>然也</h1>
		 * 		</blockquote>
		 *    	<blockquote>
		 * 			<h3>若非阅尽人间事，何处得来我是我</h1>
		 * 		</blockquote>
		 *	</div>
		 *	</div>
		 *</div>
		 */
	}
	
	var html = jOneUtil.funHtml(who_am_i_html);
		
	var whoami = $("#box12").find(".inner");
		whoami.append($(html));
		
	var poems = whoami.find("blockquote");
	
	poems.css({opacity: 0, marginLeft: -30}).css({border: "none"}).css({"border-left":"5px solid #EEEEEE"});
	
	var begin = 100;
	poems.each(function(){
		var me = this;
		var tm = setTimeout(function(){
			$(me).animate({opacity: 1, marginLeft: 20}, 800);
			clearTimeout(tm);
		}, (begin += 150));
	});
	
	poems.hover(function(){
		$(this).css({"border-left-color":"#5BB75B"});
	},function(){
		$(this).css({"border-left-color":"#EEEEEE"});
	});
});

/**
*
*  他山之石
*/
$(document).ready(function(){
	
	var $otherm = $("._othermountain_").find(".inner"),
		tileData = [
	            {title: "Page Speed", 	href:"https://developers.google.com/speed/pagespeed/insights", id: "pageSpeed",desc: "Google页面优化检测"},
	            {title: "BackBone", 	href:"http://backbonejs.org", id: "backBone", desc: "Javascript MVC框架"},
	            {title: "幸福感", 		href:"http://xingfugan.com", id: "xingfugan", desc: "幸福在哪里呀"},
		        {title: "NEC", 			href:"http://nec.netease.com", id: "nec", desc: "此NEC非彼NEC"},
			    {title: "Yslow", 		href:"http://developer.yahoo.com/yslow", id: "yslow", desc: "雅虎页面优化检测工具"},
				{title: "Nginx", 	href:"http://www.inginx.com/", id: "ngnix", desc: "Nginx中文站"}
	            ]
	//console.log($otherm);
	divider({container: $otherm, currBoxIdx: 3, tileData: tileData}).makeTile();
	
});


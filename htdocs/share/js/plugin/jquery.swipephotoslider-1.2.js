/*
 * //////////////////////////////////////////////////////////////////////
 * SwipePhotoSlider
 * 
 * @description this jquery plugin was smartphone's photoslider.
 * @version 1.1
 * @date June-2011
 * @author Yu Ishihara - http://hommebrew.com/
 * @requires jQuery v1.4.1 or later, jquery.easing.1.3, jquery.touchSwipe-1.2.4, jquery.timer
 * @example http://is8r.github.com/jquery-plugin/swipephotoslider/
 * 
 * @revised from -
 * slideViewer 1.2
 * Examples and documentation at: 
 * http://www.gcmingati.net/wordpress/wp-content/lab/jquery/imagestrip/imageslide-plugin.html
 * 2007-2010 Gian Carlo Mingati
 * Version: 1.2.3 (9-JULY-2010) 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 * @howtouse
	//head
	<!--dyrect-->
	<style type="text/css">
	.photos {
		top:10px;
	}
	.photos div.btnSet{
		clear:both;
		margin:0 auto;
		width:100px;
	}
	.photos ul.btn li a{
		display:block;
		padding:10px 0 0 10px;
		float:left;
	}
	.photos ul.btn li a.act,
	.photos ul.btn li.next a.act,
	.photos ul.btn li.back a.act
	{
		text-decoration:none;
		color:#ccc;
	}
	</style>
	<script type="text/javascript"><!--
	$(function() {
	  	$('.photos.conts0').swipephotoslider({
	  		direction:'x',
	  		loop:true,
	  		timer:true
	  	});
	  	$('.photos.conts1').swipephotoslider({
	  		direction:'y',
	  		loop:true,
	  		timer:true
	  	});
	  	$('.photos.conts2').swipephotoslider({
	  		direction:'fade',
	  		loop:true,
	  		timer:true
	  	});
	});
	// --></script>
	//body
<!--swipephotoslider-->
<div class="photos conts0">
	<div class="photoSet">
		<ul>
			<li><a href="http://google.co.jp" target="_blank"><img src="images/bnr0.jpg" alt="" width="320" height="150" /></a></li> 
			<li><a href="http://yahoo.co.jp"><img src="images/bnr1.jpg" alt="" width="320" height="150" /></a></li> 
			<li><a href="http://facebook.com"><img src="images/bnr2.jpg" alt="" width="320" height="150" /></a></li> 
		</ul>
	</div>
	<div class="btnSet">
		<ul class="btn">
			<li class="back"><a href="#">&lt;</a></li> 
			<li><a href="#">0</a></li> 
			<li><a href="#">1</a></li> 
			<li><a href="#">2</a></li> 
			<li class="next"><a href="#">&gt;</a></li> 
		</ul>
	</div>
</div>
<!--/swipephotoslider-->
 * //////////////////////////////////////////////////////////////////////
*/
$(function() {
$.fn.swipephotoslider = function(settings) {
	settings = $.extend({
		direction: 'x',//'x','y','fade'
		loop: false,
		width: -1,
		leftmargin: 0,
		height: -1,
		nowId: 0,
		maxId: -1,
		items:[],
		timer: false,
		timerDelay: 0,//最初のタイマーのタイミングをずらしたい時に使用
		timerInterval: 9000,
		easeFunc: "easeOutExpo",
		isBtn: true, //urlを直接叩いて遷移するなど、ボタンアクションを使用しない時はfalse
		easeTime: 600
	}, settings);
	
	return this.each(function(){
		var base = $(this);
		//console.log(base);
		
		//cansel
		if(base.attr('isReady') != undefined) return;
		base.attr('isReady','true');
		
		//add settings
		//settings.maxId = base.find(".photoSet > ul > li").length;
		base.find(".photoSet").each(function(i) {
			settings.maxId = $(this).find("ul > li").length;
		});
		
		if(settings.width == -1) settings.width = base.find(".photoSet > ul img").width();
		if(settings.height == -1) settings.height = base.find(".photoSet > ul img").height();
		
		//add css
		base.css("position", "relative");		
		base.css("margin", "0");		
		base.css("padding", "0");		
		base.find("ul").css("margin", "0");		
		base.find("ul").css("padding", "0");		
		base.find("ul").css("list-style", "none");		
		base.find(".photoSet").css("overflow", "hidden");
		base.find(".photoSet").css("margin", "0 auto");		
		base.find(".photoSet").css("width", settings.width);
		base.find(".photoSet").css("height", settings.height);
		base.find(".photoSet > ul").css("position", "relative");		
		base.find(".photoSet > ul > li").css("float", "left");
		
		//
		var viewerWidth;
		var viewerHeight;
		
		if(settings.direction == 'x') {
			viewerWidth = settings.width*(settings.maxId+3);
			viewerHeight = settings.height;
		} else if(settings.direction == 'y') {
			viewerWidth = settings.width;
			viewerHeight = settings.height*(settings.maxId+3);
		} else if(settings.direction == 'fade') {
			viewerWidth = settings.width;
			viewerHeight = settings.height;
		}
		
		if(settings.direction == 'x') {
			//slide - x
			base.find(".photoSet > ul").css("width" , viewerWidth);
			base.find(".photoSet > ul").css("height" , viewerHeight);
			base.find(".photoSet > ul > li").css("width" , settings.width);		
		} else if(settings.direction == 'y') {
			//slide - y
			base.find(".photoSet > ul").css("width" , viewerWidth);
			base.find(".photoSet > ul").css("height" , settings.height);
			base.find(".photoSet > ul > li").css("height" , settings.height);		
		} else if(settings.direction == 'fade') {
			//slide - fade
			base.find(".photoSet > ul").css("position" , "relative");
			base.find(".photoSet > ul > li").css("position" , "absolute");	
			base.find(".photoSet > ul > li").css("top" , "0");	
			base.find(".photoSet > ul > li").css("left" , "0");	
		}
		
		//
		if(settings.maxId < 2) {
			return;
		} else if(settings.loop == true) {
			if(settings.direction == 'x' || settings.direction == 'y') {
				//loop用に末尾に3つコピーを作成
				base.find(".photoSet").each(function(i) {
					$(this).find("ul > li").each(function(i) {
						if(i < 3) $(this).clone().appendTo($(this).parent());
					});
				});
			}
		}
		
		//////////////////////////////////////////////////////////////////////

		//timer
		var timer;
		if(settings.timer){
			timer = $.timer(settings.timerInterval, function (timer){
				base.trigger("slideNext", 1);
			});
		}
		
		//////////////////////////////////////////////////////////////////////

		//swipe + click
		try{//touchSwipeがAndroid2.2以下非対応の為回避
			base.find(".photoSet").each(function(i) {
				$(this).find("ul").each(function(i) {
					$(this).swipe({
						click:click,
						swipe:swipe,
						threshold:0,
						allowPageScroll:"auto"
					});
				});
			});
		}catch(e){};
		
		function swipe(event, direction) {
			if(settings.direction == 'x') {
				//x
			    if(direction == 'left') {
					base.trigger("slideNext", 1);
			    } else if(direction == 'right') {
					base.trigger("slideNext", -1);
			    }
			} else if(settings.direction == 'y') {
				//y
			    if(direction == 'up') {
					base.trigger("slideNext", 1);
			    } else if(direction == 'down') {
					base.trigger("slideNext", -1);
			    }
			}
			
		}
		function click(event, target)
		{
			if($(target).closest('a').length > 0) {
			    //alert($(target).closest('a').attr('href'));
			    if(!$(target).closest('a').attr('target')) $(target).closest('a').attr('target', '_self')
			    window.open($(target).closest('a').attr('href'), $(target).closest('a').attr('target'));
			    return false;
			}
		}
		
		/*
		//harf click slide(smart phone - off)
		base.find('.photoSet > ul').bind("click", function(e){
			if(e.clientX > settings.width/2) {
				base.trigger("slideNext", 1);
			} else {
				base.trigger("slideNext", -1);
			}
		});
		*/
		
		//////////////////////////////////////////////////////////////////////

		//btns
		base.find(".btnSet > ul li:not(.next,.back) a").each(function(i){
			$(this).attr('id', i);
			if(settings.isBtn) {
				$(this).click(function(e){
					base.trigger("slide", $(this).attr('id'));
					return false;
				});
			}
		});
		base.find(".btnSet > ul li.next").each(function(i){
			$(this).click(function(e){
				base.trigger("slideNext", 1);
				return false;
			});
		});
		base.find(".btnSet > ul li.back").each(function(i){
			$(this).click(function(e){
				base.trigger("slideNext", -1);
				return false;
			});
		});
		
		//////////////////////////////////////////////////////////////////////

		//slide photo
		base.bind("slide", function(e, n){
			if(!e) return;
			settings.nowId = parseInt(n);
			if(settings.timer && timer) timer.reset(settings.timerInterval);
			
			var cnt;
			if(settings.direction == 'x') {
				//x
				cnt = -(settings.width*settings.nowId)+settings.leftmargin;
				base.find(".photoSet > ul").stop().animate({left: cnt}, settings.easeTime, settings.easeFunc);
			} else if(settings.direction == 'y') {
				//y
				cnt = -(settings.height*n);
				base.find(".photoSet > ul").animate({top: cnt}, settings.easeTime);
			} else if(settings.direction == 'fade') {
				base.find('.photoSet > ul > li').each(function(i) {
					if(i == settings.nowId) $(this).fadeIn();
					else $(this).fadeOut();
				});
			}
			
			base.trigger("actBtn", settings.nowId);
		});
		base.bind("slideNext", function(e, n){
			//if(!e) return;
			
			var cnt;
			settings.nowId += parseInt(n);
			if(settings.loop) {
				
				if(settings.direction == 'x') {
					//slide - x
					//if(settings.nowId > settings.maxId-1) settings.nowId = 0;//普通のループ
					if(settings.nowId == -1 && n == -1) {//エンドレスループ-1番後ろに移動
						settings.nowId += settings.maxId;
						cnt = -(settings.width*settings.maxId)+settings.leftmargin;
						base.find(".photoSet > ul").stop().animate({left: cnt}, 0);
						base.trigger("slide", settings.nowId);
						return;
					} else if(settings.nowId == settings.maxId+1) {//エンドレスループ-1番最初に移動
						settings.nowId = 0;
						cnt = -(settings.width*settings.maxId)+settings.leftmargin;
						base.find(".photoSet").each(function(i) {
							$(this).find("ul").each(function(i) {
								$(this).stop().animate({left:0}, 0, function(){
									settings.nowId = 1;
									base.trigger("slide", settings.nowId);
									//console.log('fin!!');
								});
							});
						});
						return;
					} else if(settings.nowId < 0) {
						settings.nowId = settings.maxId-1;
						//
						base.trigger("slide", settings.nowId);
						return;
					}
				} else if(settings.direction == 'y') {
					//slide - y
					if(settings.nowId == -1 && n == -1) {//エンドレスループ-1番後ろに移動
						settings.nowId += settings.maxId;
						cnt = -(settings.height*settings.maxId)+settings.leftmargin;
						base.find(".photoSet > ul").stop().animate({top: cnt}, 0);
						base.trigger("slide", settings.nowId);
						return;
					} else if(settings.nowId == settings.maxId+1) {//エンドレスループ-1番最初に移動
						settings.nowId = 0;
						cnt = -(settings.height*settings.maxId)+settings.leftmargin;
						base.find(".photoSet").each(function(i) {
							$(this).find("ul").each(function(i) {
								$(this).stop().animate({top:0}, 0, function(){
									settings.nowId = 1;
									base.trigger("slide", settings.nowId);
									//console.log('fin!!');
								});
							});
						});
						return;
					} else if(settings.nowId < 0) {
						settings.nowId = settings.maxId-1;
						base.trigger("slide", settings.nowId);
						return;
					}
				} else if(settings.direction == 'fade') {
					if(settings.nowId > settings.maxId-1) settings.nowId = 0;//
					else if(settings.nowId < 0) settings.nowId = settings.maxId-1;
				}
			} else {
				if(settings.nowId > settings.maxId-1) settings.nowId = settings.maxId-1;
				else if(settings.nowId < 0) settings.nowId = 0;
			}
			
			//
			base.trigger("slide", settings.nowId);
		});
		
		//////////////////////////////////////////////////////////////////////

		//btn active
		base.bind("actBtn", function(e, n){
			
			if(n > settings.maxId-1) n = settings.maxId - n;
			
			if(!settings.loop) {
				base.find('.btnSet > ul li.next a').removeClass('act');
				base.find('.btnSet > ul li.back a').removeClass('act');
				if(n >= settings.maxId-1)  {
					base.find('.btnSet > ul li.next a').addClass('act');
					base.find('.btnSet > ul li.back a').removeClass('act');
				} else if(n <= 0){
					base.find('.btnSet > ul li.next a').removeClass('act');
					base.find('.btnSet > ul li.back a').addClass('act');
				}
			}
		  	base.find('.btnSet > ul li:not(.next, .back)').each(function(i) {
		  		if(i == n) {
					$(this).find('a').addClass('act');
		  		} else {
					$(this).find('a').removeClass('act');
		  		}
		  	});
		});
		
		//////////////////////////////////////////////////////////////////////

		//start
		//base.trigger("slide", 0);
		
		var firstTimer = setTimeout( function() {
			base.trigger("slide", settings.nowId);
			if(settings.timer && timer) timer.reset(settings.timerInterval);
		}, settings.timerDelay);
		
		//////////////////////////////////////////////////////////////////////

	});
};
});


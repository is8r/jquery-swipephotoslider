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
	//html
	<style type="text/css">
	.photos t{
		top:10px;
	}
	.photos div.btnSet{
		clear:both;
		margin:0 auto;
		width:100px;
	}
	.photos ul.btn li a{
		display:block;
		padding:0 0 0 10px;
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
	  	$('.photos').photoswiper({
	  		loop:true,
	  		timer:true
	  	});
	});
	// --></script>
	
	//body
	<!--swipephotoslider-->
	<div class="photos">
		<ul class="detail">
			<li><a href="http://google.co.jp" target="_blank"><img src="images/bnr0.jpg" alt="" width="320" height="150" /></a></li> 
			<li><a href="http://yahoo.co.jp"><img src="images/bnr1.jpg" alt="" width="320" height="150" /></a></li> 
			<li><a href="http://facebook.com"><img src="images/bnr2.jpg" alt="" width="320" height="150" /></a></li> 
		</ul>
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

$.fn.swipephotoslider = function(settings) {
	settings = $.extend({
		direction: 'x',
		loop: false,
		width: -1,
		leftmargin: 0,
		height: -1,
		nowId: -1,
		maxId: -1,
		timer: false,
		timerInterval: 6000,
		easeFunc: "easeOutExpo",
		easeTime: 600,
		items: []
	}, settings);
	
	return this.each(function(){
		var base = $(this);
		
		//add settings
		settings.maxId = base.find("ul.detail > li").length;
		if(settings.width == -1) settings.width = base.find("ul.detail img").width();
		if(settings.height == -1) settings.height = base.find("ul.detail img").height();
		
		//add css
		base.css("position", "relative");		
		base.css("margin", "0 auto");		
		base.css("padding", "0");		
		base.find("ul").css("margin", "0");		
		base.find("ul").css("padding", "0");		
		base.find("ul").css("list-style", "none");		
		base.css("position", "relative");
		base.css("overflow", "hidden");
		base.find("ul.detail").css("position", "relative");		
		base.find("ul.detail > li").css("float", "left");		
		
		if(settings.items.length == 0) {
			base.find("ul.detail > li").each(function(i) {
				$(this).val = i;
				settings.items.push($(this));
				$(this).css("left", settings.width*i);
				
				//loop用に末尾に3つコピーを作成
				if(i < 3) $(this).clone().appendTo($(this).parent());
			});
		};
		
		//
		var viewerWidth = settings.width*(settings.maxId+3);
		var viewerHeight = settings.height*settings.maxId;
		
		//slide - x
		base.css("width", settings.width);
		base.find("ul.detail").css("width" , viewerWidth);
		base.find("ul.detail > li").css("width" , settings.width);		
		
		//slide - y
		//base.find("ul.detail").css("height" , viewerHeight);
		//base.css("height" , settings.height);
		
		//slide - alpha
		//
		
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
		base.find("ul.detail").swipe({
			click:click,
			swipe:swipe,
			threshold:50,
			allowPageScroll:"auto"
		});
		function swipe(event, direction) {
		    if(direction == 'left') {
				base.trigger("slideNext", 1);
		    } else if(direction == 'right') {
				base.trigger("slideNext", -1);
		    }
		}
		function click(event, target)
		{
		    //alert($(target).closest('a').attr('href'));
		    if(!$(target).closest('a').attr('target')) $(target).closest('a').attr('target', '_self')
		    window.open($(target).closest('a').attr('href'), $(target).closest('a').attr('target'));
		    return false;
		}
		
		//harf click slide(smart phone - off)
		base.find('ul.detail').bind("click", function(e){
			if(e.clientX > settings.width/2) {
				base.trigger("slideNext", 1);
			} else {
				base.trigger("slideNext", -1);
			}
		});
		
		//////////////////////////////////////////////////////////////////////

		//navigation
		base.find("ul.btn li:not(.next,.back) a").each(function(i){
			$(this).attr('id', i);
			$(this).click(function(e){
				base.trigger("slide", $(this).attr('id'));
				return false;
			});
		});
		base.find("ul.btn li.next").each(function(i){
			$(this).click(function(e){
				base.trigger("slideNext", 1);
				return false;
			});
		});
		base.find("ul.btn li.back").each(function(i){
			$(this).click(function(e){
				base.trigger("slideNext", -1);
				return false;
			});
		});
		
		//slide photo
		base.bind("slide", function(e, n){
			if(!e) return;
			settings.nowId = parseInt(n);
			if(timer) timer.reset(settings.timerInterval);
			
			var cnt;
			if(settings.direction == 'x') {
				//x
				cnt = -(settings.width*settings.nowId)+settings.leftmargin;
				base.find("ul.detail").stop().animate({left: cnt}, settings.easeTime, settings.easeFunc);
			} else if(settings.direction == 'y') {
				//y
				//cnt = -(settings.height*z);
				//base.find("ul").animate({top: cnt}, settings.easeTime);
			}
			
			$(this).trigger("actBtn", settings.nowId);
		});
		$(this).bind("slideNext", function(e, n){
			//if(!e) return;
			
			var cnt;
			settings.nowId += parseInt(n);
			if(settings.loop) {
				//if(settings.nowId > settings.maxId-1) settings.nowId = 0;//普通のループ
				if(settings.nowId == -1 && n == -1) {//エンドレスループ-1番後ろに移動
					settings.nowId += settings.maxId;
					cnt = -(settings.width*settings.maxId)+settings.leftmargin;
					base.find("ul.detail").stop().animate({left: cnt}, 0);
					$(this).trigger("slide", settings.nowId);
					return;
				} else if(settings.nowId > settings.maxId) {//エンドレスループ-1番最初に移動
					settings.nowId = 0;
					cnt = -(settings.width*settings.maxId)+settings.leftmargin;
					base.find("ul.detail").stop().animate({left:0}, 0, function(){
						settings.nowId = 1;
						$(this).trigger("slide", settings.nowId);
					});
					return;
				} else if(settings.nowId < 0) {
					settings.nowId = settings.maxId-1;
				}
			} else {
				if(settings.nowId > settings.maxId-1)  {
					settings.nowId = settings.maxId-1;
				} else if(settings.nowId < 0){
					settings.nowId = 0;
				}
			}
			//
			$(this).trigger("slide", settings.nowId);
			
		});
		
		//btn active
		$(this).bind("actBtn", function(e, n){
			
			if(n > settings.maxId-1) n = settings.maxId - n;
			
			if(!settings.loop) {
				$(this).find('ul.btn li.next a').removeClass('act');
				$(this).find('ul.btn li.back a').removeClass('act');
				if(n >= settings.maxId-1)  {
					$(this).find('ul.btn li.next a').addClass('act');
					$(this).find('ul.btn li.back a').removeClass('act');
				} else if(n <= 0){
					$(this).find('ul.btn li.next a').removeClass('act');
					$(this).find('ul.btn li.back a').addClass('act');
				}
			}
		  	$(this).find('ul.btn li:not(.next, .back)').each(function(i) {
		  		if(i == n) {
					$(this).find('a').addClass('act');
		  		} else {
					$(this).find('a').removeClass('act');
		  		}
		  	});
		});
		
		//////////////////////////////////////////////////////////////////////

		//start
		$(this).trigger("slide", 0);
		
		//////////////////////////////////////////////////////////////////////

	});
};
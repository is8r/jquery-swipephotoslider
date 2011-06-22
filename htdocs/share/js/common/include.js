
//load css and js

////////////////////////////////////////////////////////////

var i;

////////////////////////////////////////////////////////////

var currentScript = (function(e){return e.nodeName.toLowerCase() == 'script' ? e : arguments.callee(e.lastChild)})(document);
var countPath = String(currentScript.getAttribute('src')).split('../');
var path = '';
if(countPath.length > 2) {
	for (i = 0; i < countPath.length-1; i++) {
		path += '../';
	};
} else {
	path = './';
}
//console.log(path);

////////////////////////////////////////////////////////////

var csss = [
	path+'share/jqm/themes/def/jquery.mobile.theme.css'
];

for (i = 0; i < csss.length; i++) {
	document.write('<link rel="stylesheet" type="text/css" href="'+csss[i]+'" media="screen,print">');
};

////////////////////////////////////////////////////////////

var jss = [
	path+'share/js/plugin/jquery-1.5.2.min.js',
	path+'share/jqm/jquery.mobile-1.0a4.1.js',
	path+'share/js/plugin/jquery.touchSwipe-1.2.4.js',
	path+'share/js/plugin/jquery.easing.1.3.js',
	path+'share/js/plugin/jquery.timer.js',
	path+'share/js/plugin/jquery.swipephotoslider-1.1.js'
];

for (i = 0; i < jss.length; i++) {
	document.write('<script type="text/javascript" src='+jss[i]+' charset="shift-jis"></script>');
};

////////////////////////////////////////////////////////////


/**
 * 拖拽
 * @param  {object} option 配置选项
 * {
 * 		el 					: 	拖拽区域元素,
 * 		targetEl 			: 	实际被拖动元素,
 * 		positionX 			: 	距左边位置,
 * 		positionY 			: 	距上边位置,
 * 		zIndex 				: 	DOM的z-index值,
 * 		marginLeft 			: 	拖拽距离左边的边界值,
 * 		marginTop 			: 	拖拽距离上边的边界值,
 * 		marginRight 		: 	拖拽距离右边的边界值,
 * 		marginBottom 		: 	拖拽距离下边的边界值
 * }
 * 
 * @return {[type]}        [description]
 */
function dDrag (option) {
	
	// option.el 需要拖拽的对象
	var el = document.querySelector(option.el);
	var targetEl;
	// 获取实际需要拖拽的对象
	if (typeof option.targetEl == 'undefined') { // 没有targetEl,则默认el为拖拽对象
		targetEl = el;
	} else { // 有targetEl
		targetEl = document.querySelector(option.targetEl);
		if (!targetEl) {
			console.error('Err: "' + option.targetEl + '" is undefined!');
			return
		}
		// 判断 el 是否是 targetEl 子孙节点
		console.log(isParent(el,targetEl))
		if ( !isParent(el, targetEl) ) {
			console.error('Err: "' + option.targetEl + '" 不是 "' + option.el + '" 的父元素！');
			return
		}
		console.dir(targetEl)
		console.log('targetEl.clientWidth: ' + targetEl.clientWidth)
	}
	el.style.cursor = 'move';
	targetEl.style.position = 'fixed';
	console.dir(el)

	/**
	 * 初始位置
	 * option.positionX 		
	 * option.positionY
	 * @type {String}
	 */
	if (typeof option.positionX == 'undefined') { // 没有 positionX 属性 设置默认值 居中
		targetEl.style.left = (window.innerWidth / 2 - targetEl.clientWidth / 2) + 'px'; 
	} else { // 有 positionX 属性
		if (/^(\d+)\.?(\d*)%$/.test(option.positionX) ) { // 百分比
			targetEl.style.left = RegExp.$2 ? 
							(window.innerWidth * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) + 'px' ) : 
							window.innerWidth * (RegExp.$1 / 100) + 'px'; 
		} else if (/^(\d+)\.?(\d*)px$/.test(option.positionX) ) { // 像素px
			targetEl.style.left = RegExp.$2 ? 
							((RegExp.$1 + '.' + RegExp.$2) + 'px') :
							(RegExp.$1 + 'px'); 
		} else if (!isNaN(Number(option.positionX)) ) { // 纯数字
			targetEl.style.left = option.positionX + 'px';
		} else if (option.positionX.toLowerCase() == 'left') { // 'left'
			targetEl.style.left = '0px';
		} else if (option.positionX.toLowerCase() == 'center') { // 'center'
			targetEl.style.left = (window.innerWidth / 2 - targetEl.clientWidth / 2) + 'px'; 
		} else if (option.positionX.toLowerCase() == 'right') { // 'right'
			targetEl.style.left = (window.innerWidth - targetEl.clientWidth) + 'px';
			console.log(targetEl.clientWidth)
		} else {
			console.error('Err: "'+ option.el + '" positionX is error');
			targetEl.style.left = (window.innerWidth / 2 - targetEl.clientWidth / 2) + 'px'; 
		}
	}

	if (typeof option.positionY == 'undefined') { // 没有 positionY 属性 设置默认值 0px
		targetEl.style.top = (window.innerHeight / 2 - targetEl.clientHeight / 2) + 'px'; 
	} else {
		if (/^(\d+)\.?(\d*)%$/.test(option.positionY) ) { // 百分比
			targetEl.style.top = 	RegExp.$2 ? 
							(window.innerHeight * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) + 'px' ) : 
							window.innerHeight * (RegExp.$1 / 100) + 'px'; 
		} else if (/^(\d+)\.?(\d*)px$/.test(option.positionY) ) { // 像素px
			targetEl.style.top = 	RegExp.$2 ? 
							((RegExp.$1 + '.' + RegExp.$2) + 'px') :
							(RegExp.$1 + 'px'); 
		} else if (!isNaN(Number(option.positionY)) ) { // 纯数字
			targetEl.style.top = option.positionY + 'px';
		} else if (option.positionY.toLowerCase() == 'top') { // 'top'
			targetEl.style.top = '0px';
		} else if (option.positionY.toLowerCase() == 'middle') { // 'middle'
			targetEl.style.top = (window.innerHeight / 2 - targetEl.clientHeight / 2) + 'px'; 
		} else if (option.positionY.toLowerCase() == 'bottom') { // 'bottom'
			targetEl.style.top = (window.innerHeight - targetEl.clientHeight) + 'px';
		} else {
			console.error('Err: "'+ option.el + '" positionY is error');
			targetEl.style.top = (window.innerHeight / 2 - targetEl.clientHeight / 2) + 'px'; 
		}
	}
	
	/**
	 * 设置 z-index 值
	 * option.zIndex 		el的z-index
	 */
	if (option.zIndex) {
		targetEl.style.zIndex = option.zIndex;
	}
	
	/**
	 * option.marginLeft 		距上边的距离
	 * option.marginTop 		距左边的距离
	 * option.marginRight 		距右边的距离
	 * option.marginBottom 		距底边的距离
	 */
	var settings = {};
	if (typeof option.marginLeft == 'undefined') {
		settings.marginLeft = 0;
	} else {
		settings.marginLeft = isNaN(parseInt(option.marginLeft)) ? 0 : parseInt(option.marginLeft);
	}
	if (typeof option.marginTop == 'undefined') {
		settings.marginTop = 0;
	} else {
		settings.marginTop = isNaN(parseInt(option.marginTop)) ? 0 : parseInt(option.marginTop);
	}
	if (typeof option.marginRight == 'undefined') {
		settings.marginRight = 0;
	} else {
		settings.marginRight = isNaN(parseInt(option.marginRight)) ? 0 : parseInt(option.marginRight);
	}
	if (typeof option.marginBottom == 'undefined') {
		settings.marginBottom = 0;
	} else {
		settings.marginBottom = isNaN(parseInt(option.marginBottom)) ? 0 : parseInt(option.marginBottom);
	}

	/**
	 * 添加mousedown事件
	 */
	el.onmousedown = function(e){
		// 记录鼠标相对 el 的位置
		// var distance_X = e.x - e.target.offsetLeft; // 鼠标相对于 el 的 X 距离
		// var distance_Y = e.y - e.target.offsetTop; // 鼠标相对于 el 的 Y 距离 dragMove(distance_X,distance_Y,event)
		var distance_X = e.x - targetEl.offsetLeft;
		var distance_Y = e.y - targetEl.offsetTop;
		document.onmousemove = function(e){
			var setX;
			var setY;
			setX = e.x - distance_X;
			setY = e.y - distance_Y;
			if (setX < settings.marginLeft) {
				targetEl.style.left = settings.marginLeft + 'px';	
			} else if (window.innerWidth - setX - targetEl.clientWidth < settings.marginRight) {
				targetEl.style.left = window.innerWidth - targetEl.clientWidth - settings.marginRight + 'px';
			} else {
				targetEl.style.left = setX + 'px';	
			}
			if (setY < settings.marginTop) {
				targetEl.style.top = settings.marginTop + 'px';
			} else if (window.innerHeight - setY - targetEl.clientHeight < settings.marginBottom) {
				targetEl.style.top = window.innerHeight - targetEl.clientHeight - settings.marginBottom + 'px';
			} else {
				targetEl.style.top = setY + 'px';	
			}
		}
		document.onmouseup = function (){
			document.onmousemove = null;
			document.onmouseup = null;
		}
		return false
	}

	// 阻止右键菜单
	targetEl.oncontextmenu = function () {
		return false;
	}
	
	
	// 判断一个元素是否是另一个元素的父元素
	function isParent (obj, parentObj) {
		while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
			if (obj == parentObj) {
				return true;
			}
			obj = obj.parentNode;
		}
		return false;
	}
}

export default dDrag
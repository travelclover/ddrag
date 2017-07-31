# ddrag
一个快速实现拖拽功能的插件

非常方便实现拖拽，只需要一句js代码

安装
	npm install ddrag --save;

初始化
	var option = {
		el: '#myDrag', // 必填项，传入id或者类名，'.myDrag', 拖拽区域元素
		targetEl: '#parent', // 可选项，实际拖拽元素，默认为 el。此元素必须是 el 的父元素， 或者是 el 元素自身
		positionX: '100px', // 可选项，设置初始位置，默认居中，也可为百分比：'30%'，也可填'left','center','right'
		positionY: '100px', // 可选项，设置初始位置，默认居中，也可为百分比：'30%'，也可填'top','middle','bottom'
		zIndex: '20', // 可选项，拖拽对象的z-index值
		marginLeft: '10px', // 可选项，拖拽的范围限制，拖距离左边的边界值,默认为0
		marginTop: '20', // 可选项，拖拽距离上边的边界值
		marginRight: '10', // 可选项，拖拽距离右边的边界值
		marginBottom: '20px', // 可选项，拖拽距离下边的边界值
		draging: function () {}, // 可选项，拖拽中的回调函数
		afterDrag: function () {}, // 可选项，每次拖拽后的回调函数
	}
	var myDdrag = new Ddrag(option);


初始化后可通过 set 方法改变初始化时的参数：
	myDdrag.set({
		marginLeft: '20px',
		positionX: '10px',
		draging: false, // false 可以取消对应的回调函数
		afterDrag: function () {}
	})


可通过以下属性获得拖拽对象的信息:
	myDdrag.top; // 100, 拖拽对象距窗口顶边的距离
	myDdrag.left; // 100, 拖拽对象距窗口左边的距离

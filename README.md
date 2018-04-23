# ddrag
一个快速实现拖拽功能的插件

非常方便实现拖拽，只需要一句js代码
也可在移动端中使用

## demo
[查看demo](https://travelclover.github.io/ddrag/)

安装

	npm install ddrag --save;

引入
```javascript
import Ddrag from 'ddrag'
```

初始化
```javascript
var option = {
	el: '#myDrag', // 必填项，传入id或者类名，'.myDrag', 拖拽区域元素
	targetEl: '#parent', // 可选项，实际拖拽元素，默认为 el。此元素必须是 el 的父元素， 或者是 el 元素自身
	left: '100px', // 可选项，设置初始位置，也可为百分比：'30%'，也可填'left','center','right',不配置默认为原始文档流中的位置
	top: '100px', // 可选项，设置初始位置，也可为百分比：'30%'，也可填'top','middle','bottom',不配置默认为原始文档流中的位置
	zIndex: '20', // 可选项，拖拽对象的z-index值
	marginLeft: '10px', // 可选项，拖拽的范围限制，拖距离左边的边界值,默认为0
	marginTop: '20', // 可选项，拖拽距离上边的边界值
	marginRight: '10', // 可选项，拖拽距离右边的边界值
	marginBottom: '20px', // 可选项，拖拽距离下边的边界值
	stop: false, // 可选项，是否暂时禁止拖拽，默认false,为true时，拖拽功能失效
	draging: function () {}, // 可选项，拖拽中的回调函数
	afterDrag: function () {}, // 可选项，每次拖拽后的回调函数
	cursor: 'pointer', // 可选项，鼠标放在可拖拽区域中时的光标形状，默认为 move
}
var myDdrag = new Ddrag(option);
```

初始化后可通过 set 方法改变初始化时的参数：
```javascript
myDdrag.set({
	marginLeft: '20px',
	left: '10px',
	stop: true, // 暂时禁止拖拽功能
	draging: false, // false 可以取消对应的回调函数
	afterDrag: function () {}
})
```

可通过以下属性获得拖拽对象的信息:
```javascript
myDdrag.top; // 100, 拖拽对象距窗口顶边的距离
myDdrag.left; // 100, 拖拽对象距窗口左边的距离
myDdrag.lastTop; // 拖拽对象上一次位置距窗口顶边的距离
myDdrag.lastLeft; // 拖拽对象上一次位置距窗口左边的距离
```

可通过destroy方法来销毁:
```javascript
myDdrag.destroy() // DOM 对象将保持销毁前的位置
myDdrag.destory(true) // DOM 对象回到原始的文档流中
```
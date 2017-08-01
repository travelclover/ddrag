/**
 * 拖拽
 * @param  {object} option 配置选项
 * {
 *      el                  :   拖拽区域元素,
 *      targetEl            :   实际被拖动元素,
 *      left                :   距左边位置,
 *      top                 :   距上边位置,
 *      zIndex              :   DOM的z-index值,
 *      marginLeft          :   拖拽距离左边的边界值,
 *      marginTop           :   拖拽距离上边的边界值,
 *      marginRight         :   拖拽距离右边的边界值,
 *      marginBottom        :   拖拽距离下边的边界值,
 *      draging             :   拖拽中的回调函数,
 *      afterDrag           :   拖动后的回调函数(function)
 * }
 *
 * @return {[type]}        [description]
 */
function Ddrag (option) {
    // option.el 需要拖拽的对象
    this.el = document.querySelector(option.el);
    // 获取实际需要拖拽的对象
    if (typeof option.targetEl == 'undefined') { // 没有targetEl,则默认el为拖拽对象
        this.targetEl = this.el;
    } else { // 有targetEl
        if (!document.querySelector(option.targetEl)) {
            console.error('Err: "' + option.targetEl + '" is undefined!');
            return
        }
        this.targetEl = document.querySelector(option.targetEl);
        // 判断 el 是否是 targetEl 子孙节点
        console.log(isParent(this.el,this.targetEl))
        if ( !isParent(this.el, this.targetEl) ) {
            console.error('Err: "' + option.targetEl + '" 不是 "' + option.el + '" 的父元素！');
            return
        }
        console.dir(this.targetEl)
        console.log('targetEl.clientWidth: ' + this.targetEl.clientWidth)
    }
    this.lastTop = this.targetEl.offsetTop;
    this.lastLeft = this.targetEl.offsetLeft;
    this.el.style.cursor = 'move';
    this.targetEl.style.position = 'fixed';
    this.targetEl.style.margin = '0'; // 设置margin值为0
    console.dir(this.el)
    console.dir(this.targetEl)
    this.top = this.targetEl.style.top;
    this.left = this.targetEl.style.left;

    var setPositionX = setX.bind(this);
    var setPositionY = setY.bind(this);

    /**
     * 初始位置
     * option.left
     * option.top
     * @type {String}
     */
    if (typeof option.left == 'undefined') { // 没有 left 属性 设置默认值 居中
        this.targetEl.style.left = (window.innerWidth / 2 - this.targetEl.clientWidth / 2) + 'px';
        this.left = (window.innerWidth / 2 - this.targetEl.clientWidth / 2);
    } else { // 有 left 属性
        setPositionX(option.left);
    }

    if (typeof option.top == 'undefined') { // 没有 top 属性 设置默认值 0px
        this.targetEl.style.top = (window.innerHeight / 2 - this.targetEl.clientHeight / 2) + 'px';
        this.top = (window.innerHeight / 2 - this.targetEl.clientHeight / 2);
    } else {
        setPositionY(option.top);
    }

    /**
     * 设置 z-index 值
     * option.zIndex        el的z-index
     */
    if (option.zIndex) {
        this.targetEl.style.zIndex = option.zIndex;
    }

    /**
     * option.marginLeft        距上边的距离
     * option.marginTop         距左边的距离
     * option.marginRight       距右边的距离
     * option.marginBottom      距底边的距离
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
     * 回调函数
     */
    var draging = null;
    var afterDrag = null;
    if (typeof option.draging !== 'undefined') {
        draging = option.draging;
    }
    if (typeof option.afterDrag !== 'undefined') {
        afterDrag = option.afterDrag;
    }

    /**
     * 添加mousedown事件
     */
    this.el.onmousedown = (e) => {
        var firstMove = true; // 该次拖拽的首次移动标记
        // 记录鼠标相对 el 的位置
        var distance_X = e.x - this.targetEl.offsetLeft; // 鼠标相对于 el 的 X 距离
        var distance_Y = e.y - this.targetEl.offsetTop; // 鼠标相对于 el 的 Y 距离 dragMove(distance_X,distance_Y,event)
        document.onmousemove = (e) => {
            if (firstMove) {
                this.lastTop = this.top;
                this.lastLeft = this.left;
                firstMove = false;
            }
            var setX;
            var setY;
            setX = e.x - distance_X;
            setY = e.y - distance_Y;
            if (setX < settings.marginLeft) {
                this.targetEl.style.left = settings.marginLeft + 'px';
                this.left = settings.marginLeft;
            } else if (window.innerWidth - setX - this.targetEl.clientWidth < settings.marginRight) {
                this.targetEl.style.left = window.innerWidth - this.targetEl.clientWidth - settings.marginRight + 'px';
                this.left = window.innerWidth - this.targetEl.clientWidth - settings.marginRight;
            } else {
                this.targetEl.style.left = setX + 'px';
                this.left = setX;
            }
            if (setY < settings.marginTop) {
                this.targetEl.style.top = settings.marginTop + 'px';
                this.top = settings.marginTop;
            } else if (window.innerHeight - setY - this.targetEl.clientHeight < settings.marginBottom) {
                this.targetEl.style.top = window.innerHeight - this.targetEl.clientHeight - settings.marginBottom + 'px';
                this.top = window.innerHeight - this.targetEl.clientHeight - settings.marginBottom;
            } else {
                this.targetEl.style.top = setY + 'px';
                this.top = setY;
            }

            if (draging) {
                draging(e)
            }
        }
        document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null;
            if (afterDrag) {
                afterDrag(e);
            }
        }
        return false
    }

    // 阻止右键菜单
    this.targetEl.oncontextmenu = function () {
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

    /**
     * 重新设置参数
     * @param  {object} opt 配置参数
     *                  {
     *                      marginLeft,
     *                      marginRight,
     *                      marginTop,
     *                      marginBottom,
     *                      left,
     *                      top
     *                  }
     * @return {[type]}     [description]
     */
    this.set = (opt) => {
        settings.marginLeft = typeof opt.marginLeft === 'undefined' ?
            settings.marginLeft :
            isNaN(parseInt(opt.marginLeft)) ?
            settings.marginLeft :
            parseInt(opt.marginLeft);
        settings.marginRight = typeof opt.marginRight === 'undefined' ?
            settings.marginRight :
            isNaN(parseInt(opt.marginRight)) ?
            settings.marginRight :
            parseInt(opt.marginRight);
        settings.marginTop = typeof opt.marginTop === 'undefined' ?
            settings.marginTop :
            isNaN(parseInt(opt.marginTop)) ?
            settings.marginTop :
            parseInt(opt.marginTop);
        settings.marginBottom = typeof opt.marginBottom === 'undefined' ?
            settings.marginBottom :
            isNaN(parseInt(opt.marginBottom)) ?
            settings.marginBottom :
            parseInt(opt.marginBottom);

        if (typeof opt.left !== 'undefined') {
            setPositionX(opt.left)
        }
        if (typeof opt.top !== 'undefined') {
            setPositionY(opt.top)
        }

        if (typeof opt.draging !== 'undefined') {
            draging = opt.draging;
        }
        if (typeof opt.afterDrag !== 'undefined') {
            afterDrag = opt.afterDrag;
        }
    }

    /**
     * 设置拖动框横轴坐标
     * @param  {string | number} x 横坐标位置
     * @return {[type]}        [description]
     */
    function setX(x) {
        this.lastLeft = this.left;
        if (/^(\d+)\.?(\d*)%$/.test(x) ) { // 百分比
            this.targetEl.style.left = RegExp.$2 ?
                (window.innerWidth * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) + 'px' ) :
                window.innerWidth * (RegExp.$1 / 100) + 'px';
            this.left = RegExp.$2 ?
                window.innerWidth * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) :
                window.innerWidth * (RegExp.$1 / 100);
        } else if (/^(\d+)\.?(\d*)px$/.test(x) ) { // 像素px
            this.targetEl.style.left = RegExp.$2 ?
                ((RegExp.$1 + '.' + RegExp.$2) + 'px') :
                (RegExp.$1 + 'px');
            this.left = RegExp.$2 ?
                (RegExp.$1 + '.' + RegExp.$2) :
                RegExp.$1;
        } else if (!isNaN(Number(x)) ) { // 纯数字
            this.targetEl.style.left = x + 'px';
            this.left = x;
        } else if (x.toLowerCase() == 'left') { // 'left'
            this.targetEl.style.left = '0px';
            this.left = 0;
        } else if (x.toLowerCase() == 'center') { // 'center'
            this.targetEl.style.left = (window.innerWidth / 2 - this.targetEl.clientWidth / 2) + 'px';
            this.left = (window.innerWidth / 2 - this.targetEl.clientWidth / 2);
            console.log(this.targetEl.clientWidth)
            console.dir(this.targetEl)
        } else if (x.toLowerCase() == 'right') { // 'right'
            this.targetEl.style.left = (window.innerWidth - this.targetEl.clientWidth) + 'px';
            this.left = (window.innerWidth - this.targetEl.clientWidth);
            console.log(this.targetEl.clientWidth)
        } else {
            console.error('Err: "'+ option.el + '" left is error');
            this.targetEl.style.left = (window.innerWidth / 2 - this.targetEl.clientWidth / 2) + 'px';
            this.left = (window.innerWidth / 2 - this.targetEl.clientWidth / 2);
        }
    }
    /**
     * 设置拖动框纵轴坐标
     * @param  {string | number} y 纵坐标位置
     * @return {[type]}        [description]
     */
    function setY(y) {
        this.lastTop = this.top;
        if (/^(\d+)\.?(\d*)%$/.test(y) ) { // 百分比
            this.targetEl.style.top = RegExp.$2 ?
                (window.innerHeight * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) + 'px' ) :
                window.innerHeight * (RegExp.$1 / 100) + 'px';
            this.top = RegExp.$2 ?
                window.innerHeight * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) :
                window.innerHeight * (RegExp.$1 / 100);
        } else if (/^(\d+)\.?(\d*)px$/.test(y) ) { // 像素px
            this.targetEl.style.top = RegExp.$2 ?
                ((RegExp.$1 + '.' + RegExp.$2) + 'px') :
                (RegExp.$1 + 'px');
            this.top = RegExp.$2 ?
                (RegExp.$1 + '.' + RegExp.$2) :
                RegExp.$1;
        } else if (!isNaN(Number(y)) ) { // 纯数字
            this.targetEl.style.top = y + 'px';
            this.top = y;
        } else if (y.toLowerCase() == 'top') { // 'top'
            this.targetEl.style.top = '0px';
            this.top = 0;
        } else if (y.toLowerCase() == 'middle') { // 'middle'
            this.targetEl.style.top = (window.innerHeight / 2 - this.targetEl.clientHeight / 2) + 'px';
            this.top = (window.innerHeight / 2 - this.targetEl.clientHeight / 2);
        } else if (y.toLowerCase() == 'bottom') { // 'bottom'
            this.targetEl.style.top = (window.innerHeight - this.targetEl.clientHeight) + 'px';
            this.top = (window.innerHeight - this.targetEl.clientHeight);
        } else {
            console.error('Err: "'+ option.el + '" top is error');
            this.targetEl.style.top = (window.innerHeight / 2 - this.targetEl.clientHeight / 2) + 'px';
            this.top = (window.innerHeight / 2 - this.targetEl.clientHeight / 2);
        }
    }
}

// export default Ddrag
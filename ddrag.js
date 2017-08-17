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
 *      stop                :   是否禁止拖拽,
 *      draging             :   拖拽中的回调函数,
 *      afterDrag           :   拖动后的回调函数(function),
 *      cursor              :   鼠标放在可拖拽区域中的样式
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
    var targetEl_rect = this.targetEl.getBoundingClientRect();
    this.lastTop = document.documentElement.scrollTop + targetEl_rect.top;
    this.lastLeft = document.documentElement.scrollTop + targetEl_rect.left;
    this.targetEl.style.margin = '0'; // 设置margin值为0
    // console.dir(this.el)
    // console.dir(this.targetEl)

    // 把拖拽对象移到 body 下
    _removeElement(this.targetEl);
    document.body.appendChild(this.targetEl);

    // 设置为 absolute 定位
    this.targetEl.style.position = 'absolute';

    var setPositionX = setX.bind(this);
    var setPositionY = setY.bind(this);

    /**
     * 初始位置
     * option.left
     * option.top
     * @type {String}
     */
    if (typeof option.left == 'undefined') { // 没有 left 属性 设置默认值 居中
        this.targetEl.style.left = this.lastLeft + 'px';
        this.left = this.lastLeft;
    } else { // 有 left 属性
        setPositionX(option.left);
    }

    if (typeof option.top == 'undefined') { // 没有 top 属性 设置默认值 0px
        this.targetEl.style.top = this.lastTop + 'px';
        this.top = this.lastTop;
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

    // 设置光标形状
    this.el.style.cursor = typeof option.cursor === 'undefined' ? 'move' : option.cursor;

    /**
     * option.marginLeft        距上边的距离
     * option.marginTop         距左边的距离
     * option.marginRight       距右边的距离
     * option.marginBottom      距底边的距离
     * option.stop              是否禁止拖拽
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
    settings.stop = typeof option.stop == 'undefined' ? false : Boolean(option.stop);

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

    var firstMove, // 某次拖拽的第一次拖动
        distance_X, // 鼠标相对于 el 的 X 距离
        distance_Y;
    var mouseDown = (e) => {
        if (settings.stop) return
        firstMove = true; // 该次拖拽的首次移动标记

        // 判断是否是移动端
        if (_isMobileDevice()) {
            // 记录触摸位置相对 el 的位置
            distance_X = e.touches[0].pageX - this.targetEl.offsetLeft;
            distance_Y = e.touches[0].pageY - this.targetEl.offsetTop;
            document.addEventListener('touchmove', mouseMove, false);
            document.addEventListener('touchend', mouseUp, false)
        } else {
            // 记录鼠标相对 el 的位置
            distance_X = e.x - this.targetEl.offsetLeft; // 鼠标相对于 el 的 X 距离
            distance_Y = e.y - this.targetEl.offsetTop; // 鼠标相对于 el 的 Y 距离 dragMove(distance_X,distance_Y,event)
            document.onmousemove = mouseMove;
            document.onmouseup = mouseUp;
        }
        return false
    }
    var mouseMove = (e) => {
        if (firstMove) {
            this.lastTop = this.top;
            this.lastLeft = this.left;
            firstMove = false;
        }
        var setX;
        var setY;
        setX = _isMobileDevice() ? e.touches[0].pageX - distance_X : e.x - distance_X;
        setY = _isMobileDevice() ? e.touches[0].pageY - distance_Y : e.y - distance_Y;
        if (setX < settings.marginLeft) {
            this.targetEl.style.left = settings.marginLeft + 'px';
            this.left = settings.marginLeft;
        } else if (document.documentElement.scrollWidth - setX - this.targetEl.clientWidth < settings.marginRight) {
            this.targetEl.style.left = document.documentElement.scrollWidth - this.targetEl.clientWidth - settings.marginRight + 'px';
            this.left = document.documentElement.scrollWidth - this.targetEl.clientWidth - settings.marginRight;
        } else {
            this.targetEl.style.left = setX + 'px';
            this.left = setX;
        }
        if (setY < settings.marginTop) {
            this.targetEl.style.top = settings.marginTop + 'px';
            this.top = settings.marginTop;
        } else if (document.documentElement.scrollHeight - setY - this.targetEl.clientHeight < settings.marginBottom) {
            this.targetEl.style.top = document.documentElement.scrollHeight - this.targetEl.clientHeight - settings.marginBottom + 'px';
            this.top = document.documentElement.scrollHeight - this.targetEl.clientHeight - settings.marginBottom;
        } else {
            this.targetEl.style.top = setY + 'px';
            this.top = setY;
        }
        // 拖动中的回调函数
        if (draging) {
            draging(e)
        }
    }
    var mouseUp = (e) => {
        if (_isMobileDevice()) {
            document.removeEventListener('touchmove', mouseMove);
            document.removeEventListener('touchend', mouseUp);
        } else {
            document.onmousemove = null;
            document.onmouseup = null;
        }
        // 拖拽完的回调函数
        if (afterDrag) {
            afterDrag(e);
        }
    }

    // 判断是否是移动端
    if (_isMobileDevice()) {
        this.el.removeEventListener('touchstart', mouseDown); // 清除已有的事件
        this.el.addEventListener('touchstart', mouseDown, false);
    } else {
        this.el.onmousedown = mouseDown;
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
        settings.stop = typeof opt.stop === 'undefined' ?
            settings.stop :
            Boolean(opt.stop);

        if (typeof opt.left !== 'undefined') {
            setPositionX(opt.left)
        }
        if (typeof opt.top !== 'undefined') {
            setPositionY(opt.top)
        }

        if (typeof opt.zIndex !== 'undefined') {
            this.targetEl.style.zIndex = opt.zIndex;
        }

        if (typeof opt.cursor !== 'undefined') {
            this.el.style.cursor = opt.cursor;
        }

        if (typeof opt.draging !== 'undefined') {
            draging = opt.draging;
        }
        if (typeof opt.afterDrag !== 'undefined') {
            afterDrag = opt.afterDrag;
        }
    }

    /**
     * 销毁
     * @param  {Boolean} regain 是否恢复原始状态
     * @return {[type]}        [description]
     */
    this.destroy = (regain) => {
        this.el.onmousedown = null;
        if (typeof regain === 'boolean' && regain) {
            this.targetEl.style.position = 'static';
            this.targetEl.style.left = '0';
            this.targetEl.style.top = '0';
        }
        this.el.style.cursor = 'auto';
        var destroyObj = this;
        destroyObj = null
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
                (document.documentElement.scrollWidth * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) + 'px' ) :
                document.documentElement.scrollWidth * (RegExp.$1 / 100) + 'px';
            this.left = RegExp.$2 ?
                document.documentElement.scrollWidth * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) :
                document.documentElement.scrollWidth * (RegExp.$1 / 100);
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
            this.targetEl.style.left = (document.documentElement.scrollWidth / 2 - this.targetEl.clientWidth / 2) + 'px';
            this.left = (document.documentElement.scrollWidth / 2 - this.targetEl.clientWidth / 2);
            console.log(this.targetEl.clientWidth)
            console.dir(this.targetEl)
        } else if (x.toLowerCase() == 'right') { // 'right'
            this.targetEl.style.left = (document.documentElement.scrollWidth - this.targetEl.clientWidth) + 'px';
            this.left = (document.documentElement.scrollWidth - this.targetEl.clientWidth);
            console.log(this.targetEl.clientWidth)
        } else {
            console.error('Err: "'+ option.el + '" left is error');
            this.targetEl.style.left = (document.documentElement.scrollWidth / 2 - this.targetEl.clientWidth / 2) + 'px';
            this.left = (document.documentElement.scrollWidth / 2 - this.targetEl.clientWidth / 2);
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
                (document.documentElement.scrollHeight * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) + 'px' ) :
                document.documentElement.scrollHeight * (RegExp.$1 / 100) + 'px';
            this.top = RegExp.$2 ?
                document.documentElement.scrollHeight * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) :
                document.documentElement.scrollHeight * (RegExp.$1 / 100);
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
            this.targetEl.style.top = (document.documentElement.scrollHeight / 2 - this.targetEl.clientHeight / 2) + 'px';
            this.top = (document.documentElement.scrollHeight / 2 - this.targetEl.clientHeight / 2);
        } else if (y.toLowerCase() == 'bottom') { // 'bottom'
            this.targetEl.style.top = (document.documentElement.scrollHeight - this.targetEl.clientHeight) + 'px';
            this.top = (document.documentElement.scrollHeight - this.targetEl.clientHeight);
        } else {
            console.error('Err: "'+ option.el + '" top is error');
            this.targetEl.style.top = (document.documentElement.scrollHeight / 2 - this.targetEl.clientHeight / 2) + 'px';
            this.top = (document.documentElement.scrollHeight / 2 - this.targetEl.clientHeight / 2);
        }
    }
}

/**
 * 判断是否是移动端设备
 * @return {Boolean} 返回 true | false
 */
function _isMobileDevice () {
    var _devices = navigator.userAgent.toLowerCase();
    var bIsIpad = _devices.match(/ipad/i) == 'ipad';
    var bIsIphoneOs = _devices.match(/iphone os/i) == 'iphone os';
    var bIsMidp = _devices.match(/midp/i) == 'midp';
    var bIsUc7 = _devices.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
    var bIsUc = _devices.match(/ucweb/i) == 'ucweb';
    var bIsAndroid = _devices.match(/android/i) == 'android';
    var bIsCE = _devices.match(/windows ce/i) == 'windows ce';
    var bIsWM = _devices.match(/windows mobile/i) == 'windows mobile';
    if (bIsIpad ||
        bIsIphoneOs ||
        bIsMidp ||
        bIsUc7 ||
        bIsUc ||
        bIsAndroid ||
        bIsCE ||
        bIsWM) {
        // 移动端
        return true
    } else {
        // pc 端
        return false
    }
}

/**
 * 从父节点中移除该节点
 * @param  {object} _element 需要删除的节点
 * @return {[type]}          [description]
 */
function _removeElement (_element) {
    var _parentElement = _element.parentNode;
    if (_parentElement) {
        _parentElement.removeChild(_element);
    }
}

// export default Ddrag
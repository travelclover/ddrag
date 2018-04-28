import util from '@/util.js'

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
 */
function Ddrag(option) {
  this.top = '';
  this.left = '';
  this.lastTop = '';
  this.lastLeft = '';
  /**
   * 销毁
   * @param  {Boolean} regain 是否恢复原始状态
   */
  this.destroy = (regain) => {
    el.onmousedown = null;
    if (typeof regain === 'boolean' && regain) {
      targetEl.style.position = 'static';
      targetEl.style.left = '0';
      targetEl.style.top = '0';
    }
    el.style.cursor = 'auto';
    let destroyObj = this;
    destroyObj = null;
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
      targetEl.style.zIndex = opt.zIndex;
    }

    if (typeof opt.cursor !== 'undefined') {
      el.style.cursor = opt.cursor;
    }

    if (typeof opt.draging !== 'undefined') {
      draging = opt.draging;
    }
    if (typeof opt.afterDrag !== 'undefined') {
      afterDrag = opt.afterDrag;
    }
  }

  let el = document.querySelector(option.el); // option.el 需要拖拽的对象
  let targetEl = el; // 实际需要拖拽的对象

  // 当配置了targetEl选项
  if (typeof option.targetEl != 'undefined') {
    if (!document.querySelector(option.targetEl)) {
      console.error('Err: "' + option.targetEl + '" is undefined!');
      return
    }
    targetEl = document.querySelector(option.targetEl);
    // 判断 targetEl 是否是 el 祖先节点
    if (!util.isParentsNode(targetEl, el)) {
      console.error('Err: "' + option.targetEl + '" 不是 "' + option.el + '" 的父元素！');
      return
    }
  }

  // 设置原始坐标位置
  let targetEl_rect = targetEl.getBoundingClientRect();
  this.lastTop = document.documentElement.scrollTop + targetEl_rect.top;
  this.lastLeft = document.documentElement.scrollTop + targetEl_rect.left;

  // 把拖拽对象移到 body 下
  util.removeElement(targetEl);
  document.body.appendChild(targetEl);

  targetEl.style.margin = '0'; // 设置margin值为0
  targetEl.style.position = 'absolute'; // 设置为 absolute 定位
  option.zIndex ? targetEl.style.zIndex = option.zIndex : null; // 设置 z-index 值
  el.style.cursor = typeof option.cursor === 'undefined' ? 'move' : option.cursor; // 设置光标形状

  let setPositionX = setX.bind(this);
  let setPositionY = setY.bind(this);

  // 阻止右键菜单
  targetEl.oncontextmenu = function () {
    return false;
  }

  // 初始位置
  if (typeof option.left == 'undefined') { // 没有 left 属性 设置默认值 居中
    targetEl.style.left = this.lastLeft + 'px';
    this.left = this.lastLeft;
  } else { // 有 left 属性
    setPositionX(option.left);
  }

  if (typeof option.top == 'undefined') { // 没有 top 属性 设置默认值 0px
    targetEl.style.top = this.lastTop + 'px';
    this.top = this.lastTop;
  } else {
    setPositionY(option.top);
  }

  /**
     * option.marginLeft        距上边的距离
     * option.marginTop         距左边的距离
     * option.marginRight       距右边的距离
     * option.marginBottom      距底边的距离
     * option.stop              是否禁止拖拽
     */
  let settings = {};
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
  let draging = null;
  let afterDrag = null;
  if (typeof option.draging !== 'undefined') {
    draging = option.draging;
  }
  if (typeof option.afterDrag !== 'undefined') {
    afterDrag = option.afterDrag;
  }

  let firstMove, // 某次拖拽的第一次拖动
    distance_X, // 鼠标相对于 el 的 X 距离
    distance_Y;
  let mouseDown = (e) => {
    if (settings.stop) return
    firstMove = true; // 该次拖拽的首次移动标记

    // 判断是否是移动端
    if (util.isMobileDevice()) {
      // 记录触摸位置相对 el 的位置
      distance_X = e.touches[0].pageX - targetEl.offsetLeft;
      distance_Y = e.touches[0].pageY - targetEl.offsetTop;
      document.addEventListener('touchmove', mouseMove, false);
      document.addEventListener('touchend', mouseUp, false)
    } else {
      // 记录鼠标相对 el 的位置
      distance_X = e.x - targetEl.offsetLeft; // 鼠标相对于 el 的 X 距离
      distance_Y = e.y - targetEl.offsetTop; // 鼠标相对于 el 的 Y 距离 dragMove(distance_X,distance_Y,event)
      document.onmousemove = mouseMove;
      document.onmouseup = mouseUp;
    }
    return false
  }
  let mouseMove = (e) => {
    if (firstMove) {
      this.lastTop = this.top;
      this.lastLeft = this.left;
      firstMove = false;
    }
    let setX;
    let setY;
    setX = util.isMobileDevice() ? e.touches[0].pageX - distance_X : e.x - distance_X;
    setY = util.isMobileDevice() ? e.touches[0].pageY - distance_Y : e.y - distance_Y;
    if (setX < settings.marginLeft) {
      targetEl.style.left = settings.marginLeft + 'px';
      this.left = settings.marginLeft;
    } else if (document.documentElement.scrollWidth - setX - targetEl.offsetWidth < settings.marginRight) {
      targetEl.style.left = document.documentElement.scrollWidth - targetEl.offsetWidth - settings.marginRight + 'px';
      this.left = document.documentElement.scrollWidth - targetEl.offsetWidth - settings.marginRight;
    } else {
      targetEl.style.left = setX + 'px';
      this.left = setX;
    }
    if (setY < settings.marginTop) {
      targetEl.style.top = settings.marginTop + 'px';
      this.top = settings.marginTop;
    } else if (document.documentElement.scrollHeight - setY - targetEl.offsetHeight < settings.marginBottom) {
      targetEl.style.top = document.documentElement.scrollHeight - targetEl.offsetHeight - settings.marginBottom + 'px';
      this.top = document.documentElement.scrollHeight - targetEl.offsetHeight - settings.marginBottom;
    } else {
      targetEl.style.top = setY + 'px';
      this.top = setY;
    }
    // 拖动中的回调函数
    if (draging) {
      draging(e)
    }
  }
  let mouseUp = (e) => {
    if (util.isMobileDevice()) {
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
  if (util.isMobileDevice()) {
    el.removeEventListener('touchstart', mouseDown); // 清除已有的事件
    el.addEventListener('touchstart', mouseDown, false);
  } else {
    el.onmousedown = mouseDown;
  }

  /**
     * 设置拖动框横轴坐标
     * @param  {string | number} x 横坐标位置
     * @return {[type]}        [description]
     */
  function setX(x) {
    this.lastLeft = this.left;
    if (/^(\d+)\.?(\d*)%$/.test(x)) { // 百分比
      targetEl.style.left = RegExp.$2 ?
        (document.documentElement.scrollWidth * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) + 'px') :
        document.documentElement.scrollWidth * (RegExp.$1 / 100) + 'px';
      this.left = RegExp.$2 ?
        document.documentElement.scrollWidth * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) :
        document.documentElement.scrollWidth * (RegExp.$1 / 100);
    } else if (/^(\d+)\.?(\d*)px$/.test(x)) { // 像素px
      targetEl.style.left = RegExp.$2 ?
        ((RegExp.$1 + '.' + RegExp.$2) + 'px') :
        (RegExp.$1 + 'px');
      this.left = RegExp.$2 ?
        (RegExp.$1 + '.' + RegExp.$2) :
        RegExp.$1;
    } else if (!isNaN(Number(x))) { // 纯数字
      targetEl.style.left = x + 'px';
      this.left = x;
    } else if (x.toLowerCase() == 'left') { // 'left'
      targetEl.style.left = '0px';
      this.left = 0;
    } else if (x.toLowerCase() == 'center') { // 'center'
      targetEl.style.left = (document.documentElement.scrollWidth / 2 - targetEl.offsetWidth / 2) + 'px';
      this.left = (document.documentElement.scrollWidth / 2 - targetEl.offsetWidth / 2);
    } else if (x.toLowerCase() == 'right') { // 'right'
      targetEl.style.left = (document.documentElement.scrollWidth - targetEl.offsetWidth) + 'px';
      this.left = (document.documentElement.scrollWidth - targetEl.offsetWidth);
    } else {
      console.error('Err: "' + option.el + '" left is error');
      targetEl.style.left = (document.documentElement.scrollWidth / 2 - targetEl.offsetWidth / 2) + 'px';
      this.left = (document.documentElement.scrollWidth / 2 - targetEl.offsetWidth / 2);
    }
  }
  /**
   * 设置拖动框纵轴坐标
   * @param  {string | number} y 纵坐标位置
   * @return {[type]}        [description]
   */
  function setY(y) {
    this.lastTop = this.top;
    if (/^(\d+)\.?(\d*)%$/.test(y)) { // 百分比
      targetEl.style.top = RegExp.$2 ?
        (document.documentElement.scrollHeight * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) + 'px') :
        document.documentElement.scrollHeight * (RegExp.$1 / 100) + 'px';
      this.top = RegExp.$2 ?
        document.documentElement.scrollHeight * (Number(RegExp.$1 + '.' + RegExp.$2) / 100) :
        document.documentElement.scrollHeight * (RegExp.$1 / 100);
    } else if (/^(\d+)\.?(\d*)px$/.test(y)) { // 像素px
      targetEl.style.top = RegExp.$2 ?
        ((RegExp.$1 + '.' + RegExp.$2) + 'px') :
        (RegExp.$1 + 'px');
      this.top = RegExp.$2 ?
        (RegExp.$1 + '.' + RegExp.$2) :
        RegExp.$1;
    } else if (!isNaN(Number(y))) { // 纯数字
      targetEl.style.top = y + 'px';
      this.top = y;
    } else if (y.toLowerCase() == 'top') { // 'top'
      targetEl.style.top = '0px';
      this.top = 0;
    } else if (y.toLowerCase() == 'middle') { // 'middle'
      targetEl.style.top = (document.documentElement.scrollHeight / 2 - targetEl.offsetHeight / 2) + 'px';
      this.top = (document.documentElement.scrollHeight / 2 - targetEl.offsetHeight / 2);
    } else if (y.toLowerCase() == 'bottom') { // 'bottom'
      targetEl.style.top = (document.documentElement.scrollHeight - targetEl.offsetHeight) + 'px';
      this.top = (document.documentElement.scrollHeight - targetEl.offsetHeight);
    } else {
      console.error('Err: "' + option.el + '" top is error');
      targetEl.style.top = (document.documentElement.scrollHeight / 2 - targetEl.offsetHeight / 2) + 'px';
      this.top = (document.documentElement.scrollHeight / 2 - targetEl.offsetHeight / 2);
    }
  }

}

export default Ddrag;
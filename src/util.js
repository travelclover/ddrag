
/**
 * 从父节点中移除该节点
 * @param  {object} element 需要删除的节点
 * @return {[type]}          [description]
 */
function removeElement(element) {
  var parentElement = element.parentNode;
  if (parentElement) {
    parentElement.removeChild(element);
  }
}

/**
 * 判断是否是移动端设备
 * @return {Boolean} 返回 true | false
 */
function isMobileDevice() {
  var devices = navigator.userAgent.toLowerCase();
  var bIsIpad = devices.match(/ipad/i) == 'ipad';
  var bIsIphoneOs = devices.match(/iphone os/i) == 'iphone os';
  var bIsMidp = devices.match(/midp/i) == 'midp';
  var bIsUc7 = devices.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
  var bIsUc = devices.match(/ucweb/i) == 'ucweb';
  var bIsAndroid = devices.match(/android/i) == 'android';
  var bIsCE = devices.match(/windows ce/i) == 'windows ce';
  var bIsWM = devices.match(/windows mobile/i) == 'windows mobile';
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
 * 判断一个元素是否是另一个元素的祖先元素
 * @param  {object} parentsNode  祖先节点
 * @param  {object} node         子孙节点
 * @return {boolean}             是返回true,不是返回false
 */
function isParentsNode(parentsNode, node) {
  while (node != undefined && node != null && node.tagName.toUpperCase() != 'BODY') {
    if (node == parentsNode) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export default {
  removeElement, // 从父节点中移除该节点
  isMobileDevice, // 判断是否是移动端设备
  isParentsNode, // 判断一个元素是否是另一个元素的祖先元素
}
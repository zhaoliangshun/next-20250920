/**
 * 判断两个DOM元素是否重叠（支持部分重叠/完全包含）
 * @param {HTMLElement} el1 - 第一个元素
 * @param {HTMLElement} el2 - 第二个元素
 * @returns {boolean} 重叠返回true，否则返回false（元素不存在返回false）
 */
function isElementsOverlap(el1, el2) {
    // 校验元素是否有效（非null/非HTMLElement则返回false）
    if (!el1 || !el2 || !(el1 instanceof HTMLElement) || !(el2 instanceof HTMLElement)) {
        console.warn('传入的参数不是有效的DOM元素');
        return false;
    }

    // 获取元素的边界矩形（视口坐标系）
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    // 处理元素隐藏的情况（宽高为0时视为不重叠）
    if (rect1.width === 0 || rect1.height === 0 || rect2.width === 0 || rect2.height === 0) {
        return false;
    }

    // 判断是否重叠：反向判断“不重叠”，取反即为重叠
    const isNotOverlap = 
        rect1.bottom <= rect2.top ||    // el1在el2上方
        rect1.top >= rect2.bottom ||    // el1在el2下方
        rect1.right <= rect2.left ||    // el1在el2左侧
        rect1.left >= rect2.right;      // el1在el2右侧

    return !isNotOverlap;
}
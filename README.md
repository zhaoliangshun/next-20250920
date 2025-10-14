function getVisibleHeight(element) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // visibleHeight 是元素在视口中的可见高度
      const visibleHeight = entry.intersectionRect.height;
      console.log('可见高度:', visibleHeight);
    });
  });
  
  observer.observe(element);
  return observer;
}

// 使用示例
const targetElement = document.getElementById('myElement');
getVisibleHeight(targetElement);

function getElementVisibleHeight(element, container = null) {
  // 如果指定了容器，在容器内计算可见高度
  if (container) {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const visibleTop = Math.max(elementRect.top, containerRect.top);
    const visibleBottom = Math.min(elementRect.bottom, containerRect.bottom);
    
    return Math.max(0, visibleBottom - visibleTop);
  }
  
  // 否则在视口中计算可见高度
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  
  const elementTop = Math.max(0, rect.top);
  const elementBottom = Math.min(viewportHeight, rect.bottom);
  
  return Math.max(0, elementBottom - elementTop);
}

// 使用示例
const targetElement = document.getElementById('myElement');

// 在视口中的可见高度
const visibleHeight1 = getElementVisibleHeight(targetElement);
console.log('视口中的可见高度:', visibleHeight1);

// 在特定容器中的可见高度
const container = document.getElementById('container');
const visibleHeight2 = getElementVisibleHeight(targetElement, container);
console.log('容器中的可见高度:', visibleHeight2);


/**
 * 计算元素在视口中的可视高度（排除被遮盖/超出视口的部分）
 * @param {HTMLElement} element - 目标元素
 * @returns {number} 可视高度（单位：px）
 */
function getVisibleHeight(element) {
  if (!element || !(element instanceof HTMLElement)) {
    return 0;
  }

  // 1. 获取元素的布局信息
  const rect = element.getBoundingClientRect(); // 相对于视口的位置
  const elementHeight = rect.height; // 元素自身高度（包含padding、border）
  const elementTop = rect.top; // 元素顶部相对于视口顶部的距离
  const elementBottom = rect.bottom; // 元素底部相对于视口顶部的距离

  // 2. 确定可视区域的边界（默认视口为window，若元素在滚动容器内需调整）
  let viewportTop = 0;
  let viewportBottom = window.innerHeight;

  // 处理元素在滚动容器内的情况（如父元素有overflow: auto）
  let parent = element.parentElement;
  while (parent) {
    const parentStyle = getComputedStyle(parent);
    // 判断父元素是否为滚动容器
    if (parentStyle.overflowY === 'auto' || parentStyle.overflowY === 'scroll') {
      const parentRect = parent.getBoundingClientRect();
      viewportTop = parentRect.top; // 滚动容器顶部相对于视口的位置
      viewportBottom = parentRect.bottom; // 滚动容器底部相对于视口的位置
      break;
    }
    parent = parent.parentElement;
  }

  // 3. 计算元素与可视区域的交集高度
  // 元素完全在可视区域内
  if (elementTop >= viewportTop && elementBottom <= viewportBottom) {
    return elementHeight;
  }
  // 元素部分在可视区域内（顶部超出）
  else if (elementTop < viewportTop && elementBottom <= viewportBottom && elementBottom > viewportTop) {
    return elementBottom - viewportTop;
  }
  // 元素部分在可视区域内（底部超出）
  else if (elementTop >= viewportTop && elementTop < viewportBottom && elementBottom > viewportBottom) {
    return viewportBottom - elementTop;
  }
  // 元素完全被可视区域包含（但自身高度超过可视区域）
  else if (elementTop < viewportTop && elementBottom > viewportBottom) {
    return viewportBottom - viewportTop;
  }
  // 元素完全在可视区域外
  else {
    return 0;
  }
}
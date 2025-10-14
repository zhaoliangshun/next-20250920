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
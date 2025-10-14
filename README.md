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
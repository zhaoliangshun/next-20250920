react-mobile-picker
function isSafari() {
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isMac = /Macintosh/.test(ua) && 'ontouchend' in document;
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  
  return isSafari || isIOS || isMac;
}

// 获取Safari版本号
function getSafariVersion() {
  const ua = window.navigator.userAgent;
  const match = ua.match(/Version\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// 使用示例
if (isSafari()) {
  const version = getSafariVersion();
  if (version) {
    console.log(`检测到Safari浏览器，版本: ${version}`);
    if (version >= 15) {
      // 针对Safari 15+的特定处理
    }
  } else {
    console.log('检测到Safari浏览器，但无法确定版本号');
  }
} else {
  console.log('当前不是Safari浏览器');
}
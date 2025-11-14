function isiPhoneBrowser() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // 檢測是否包含 'iPhone' 或 'iPod' 關鍵字，並排除模擬器情況（可選）
    if (/iPhone|iPod/i.test(userAgent)) {
        // 進一步判斷是否為 iOS 設備（更通用的判斷）
        var isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        
        // 判斷是否為 Safari 或 App 內建瀏覽器（兩者都使用 WebKit 核心）
        // iOS 上的所有瀏覽器都必須使用 WebKit 渲染引擎。
        return isiOS; 
    } else {
        return false;
    }
}


.image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.image-container::before,
.image-container::after {
  content: '';
  position: absolute;
  top: 0;
  width: 50px; /* 模糊区域的宽度 */
  height: 100%;
  z-index: 1;
}

.image-container::before {
  left: 0;
  background: linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
}

.image-container::after {
  right: 0;
  background: linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
}

.image-container img {
  display: block;
  width: 100%;
  height: auto;
}

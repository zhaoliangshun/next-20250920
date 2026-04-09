function openPopup(url) {
  if (window.myPopup && !window.myPopup.closed) {
    console.log(window.myPopup)
    // window.myPopup.location.href = url;
    // window.myPopup.focus();
    window?.myPopup?.close?.();
    // return;
  }
  // 关键：用 _blank 避开命名窗口死锁 Bug
  window.myPopup = window.open(url, '_blank', 'width=800,height=600');
}

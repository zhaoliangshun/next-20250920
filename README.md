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
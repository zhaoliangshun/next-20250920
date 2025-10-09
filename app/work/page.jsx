"use client"

import React, { useState } from "react";
import style from "./page.module.scss";
import PopUpLayer from "./PopUpLayer";

const Description = ({ title, text, hasEditIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={style.KeyFactors}>
      <div className={style.header}>
        <div className={style.titleContainer}>
          <span className={style.title}>{title}</span>
          <span className={style.icon}></span>
        </div>
        {hasEditIcon && <div onClick={(() => {setIsOpen(true)})} className={style.editIconContainer}>
          <span className={style.editIcon}></span>
          <span className={style.editText}>
            Edit
          </span>
        </div>
        }
      </div>
      <span className={style.text}>{text}</span>
      <PopUpLayer isOpen={isOpen} setIsOpen={setIsOpen}>
        <div>
          <h3>欢迎使用居中弹窗组件！</h3>
          <p>这是一个功能完整的居中弹窗组件，具有以下特性：</p>
          <ul>
            <li>居中显示的弹窗效果</li>
            <li>缩放和淡入淡出动画</li>
            <li>多种尺寸选择（小、中、大）</li>
            <li>键盘 ESC 键关闭支持</li>
            <li>点击背景关闭功能</li>
            <li>响应式设计，适配各种屏幕</li>
          </ul>
        </div>
      </PopUpLayer>
    </div>
  );
};

const Work = () => {
  return (
    <Description
      title={"Importance"}
      text={"Modify the weight factor to influence the outcome of the simulation."}
      hasEditIcon={true}
    />
  );
};
export default Work;

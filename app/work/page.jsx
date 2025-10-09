"use client"

import React, { useState } from "react";
import style from "./page.module.scss";
import PopUpLayer from "./PopUpLayer";

const Description = ({ title, text, hasEditIcon }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isImportanceOpen, setIsImportanceOpen] = useState(false);
  const keyIndicators = [
    { title: "Importance", text: "Modify the weight factor to influence the outcome of the simulation.Modify the weight factor to influence the outcome of the simulation.Modify the weight factor to influence the outcome of the simulation.Modify the weight factor to influence the outcome of the simulation.Modify the weight factor to influence the outcome of the simulation.Modify the weight factor to influence the outcome of the simulation.Modify the weight factor to influence the outcome of the simulation.", hasEditIcon: true },
    { title: "Confidence", text: "Adjust the confidence level to reflect your certainty about the data.Adjust the confidence level to reflect your certainty about the data.Adjust the confidence level to reflect your certainty about the data.Adjust the confidence level to reflect your certainty about the data.Adjust the confidence level to reflect your certainty about the data.Adjust the confidence level to reflect your certainty about the data.", hasEditIcon: false },
    { title: "Ease of Implementation", text: "Set the ease factor to evaluate how easily this can be implemented.Set the ease factor to evaluate how easily this can be implemented.Set the ease factor to evaluate how easily this can be implemented.Set the ease factor to evaluate how easily this can be implemented.Set the ease factor to evaluate how easily this can be implemented.", hasEditIcon: false },
    { title: "Importance", text: "Modify the weight factor to influence the outcome of the simulation.Modify the weight factor to influence the outcome of the simulation.Modify the weight factor to influence the outcome of the simulation.Modify the weight factor to influence the outcome of the simulation.", hasEditIcon: true },
    { title: "Confidence", text: "Adjust the confidence level to reflect your certainty about the data.Adjust the confidence level to reflect your certainty about the data.Adjust the confidence level to reflect your certainty about the data.Adjust the confidence level to reflect your certainty about the data.", hasEditIcon: false },
    { title: "Ease of Implementation", text: "Set the ease factor to evaluate how easily this can be implemented.", hasEditIcon: false },
    { title: "Importance", text: "Modify the weight factor to influence the outcome of the simulation.", hasEditIcon: true },
    { title: "Confidence", text: "Adjust the confidence level to reflect your certainty about the data.", hasEditIcon: false },
    { title: "Ease of Implementation", text: "Set the ease factor to evaluate how easily this can be implemented.", hasEditIcon: false },
    { title: "Importance", text: "Modify the weight factor to influence the outcome of the simulation.", hasEditIcon: true },
    { title: "Confidence", text: "Adjust the confidence level to reflect your certainty about the data.", hasEditIcon: false },
    { title: "Ease of Implementation", text: "Set the ease factor to evaluate how easily this can be implemented.", hasEditIcon: false },
    { title: "Importance", text: "Modify the weight factor to influence the outcome of the simulation.", hasEditIcon: true },
    { title: "Confidence", text: "Adjust the confidence level to reflect your certainty about the data.", hasEditIcon: false },
    { title: "Ease of Implementation", text: "Set the ease factor to evaluate how easily this can be implemented.", hasEditIcon: false },
  ];

  return (
    <div className={style.KeyFactors}>
      <div className={style.header}>
        <div className={style.titleContainer} onClick={(() => {setIsImportanceOpen(true)})}>
          <span className={style.title}>{title}</span>
          <span className={style.icon}></span>
        </div>
        {hasEditIcon && <div onClick={(() => {setIsEditOpen(true)})} className={style.editIconContainer}>
          <span className={style.editIcon}></span>
          <span className={style.editText}>
            Edit
          </span>
        </div>
        }
      </div>
      <span className={style.text}>{text}</span>
      <PopUpLayer isOpen={isEditOpen} setIsOpen={setIsEditOpen}>
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
      <PopUpLayer title={'Importance'} isOpen={isImportanceOpen} setIsOpen={setIsImportanceOpen}>
        <div className={style.listContainer}> 
        {
          keyIndicators.map((item, index) => (
            <div key={index} className={style.item}>
              <span className={style.itemTitle}>{item.title}</span>
              <span className={style.itemText}>{item.text}</span>
            </div>
          ))
        }
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

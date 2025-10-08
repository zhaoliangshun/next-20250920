import React from "react";
import style from "./page.module.scss";

const Description = ({ title, text, hasEditIcon }) => {
  return (
    <div className={style.KeyFactors}>
      <div className={style.header}>
        <div className={style.titleContainer}>
          <span className={style.title}>{title}</span>
          <span className={style.icon}></span>
        </div>
        {hasEditIcon &&  <div className={style.editIconContainer}>
          <span className={style.editIcon}></span>
          <span className={style.editText}>
            Edit
          </span>
        </div>
        }
      </div>

      <span className={style.text}>{text}</span>
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

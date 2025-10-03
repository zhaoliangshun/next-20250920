"use client";

import React from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.css";

/**
 * Button 组件
 * 支持多种样式变体、主题颜色、尺寸定制和交互状态
 */
const Button = ({
  children,
  variant = "filled", // filled(有色背景) 或 outlined(白色背景+边框)
  themeColor = "#2655CC",
  hoverColor,
  activeColor,
  width = 200,
  height = 40,
  disabled = false,
  onClick,
  className = "",
  style = {},
  type = "button",
  textColor,
  ...rest
}) => {
  // 计算 hover 和 active 颜色（如果未提供）
  const getColorVariant = (baseColor, brightness) => {
    // 简单的颜色变化算法
    const color = baseColor.replace("#", "");
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    const adjust = (value, factor) => {
      const adjusted = Math.round(value + (255 - value) * factor);
      return Math.max(0, Math.min(255, adjusted));
    };

    const adjustDarken = (value, factor) => {
      const adjusted = Math.round(value * (1 - factor));
      return Math.max(0, Math.min(255, adjusted));
    };

    let newR, newG, newB;
    if (brightness > 0) {
      // 变亮
      newR = adjust(r, brightness);
      newG = adjust(g, brightness);
      newB = adjust(b, brightness);
    } else {
      // 变暗
      newR = adjustDarken(r, -brightness);
      newG = adjustDarken(g, -brightness);
      newB = adjustDarken(b, -brightness);
    }

    return `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  };

  const computedHoverColor = hoverColor || getColorVariant(themeColor, 0.15);
  const computedActiveColor = activeColor || getColorVariant(themeColor, -0.15);

  // 构建按钮样式
  const buttonStyle = {
    width: width || "auto",
    height: height || "auto",
    ...(textColor && { "--text-color": textColor }),
    ...style,
  };

  // 根据 variant 设置不同的 CSS 变量
  const cssVariables = {
    "--theme-color": themeColor,
    "--hover-color": computedHoverColor,
    "--active-color": computedActiveColor,
    "--text-color":
      textColor || (variant === "filled" ? "#ffffff" : themeColor),
  };

  // 合并所有样式
  const finalStyle = { ...buttonStyle, ...cssVariables };

  // 构建 className
  const buttonClassName = [
    styles.button,
    variant === "filled" ? styles.buttonFilled : styles.buttonOutlined,
    disabled ? styles.buttonDisabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 处理点击事件
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={buttonClassName}
      style={finalStyle}
      onClick={handleClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  // 按钮内容
  children: PropTypes.node.isRequired,

  // 样式变体：filled(有色背景无边框) 或 outlined(白色背景有色边框)
  variant: PropTypes.oneOf(["filled", "outlined"]),

  // 主题颜色
  themeColor: PropTypes.string,

  // 文字颜色（不设置则自动使用白色或主题色）
  textColor: PropTypes.string,

  // hover 时的颜色（不设置则自动计算）
  hoverColor: PropTypes.string,

  // 点击时的颜色（不设置则自动计算）
  activeColor: PropTypes.string,

  // 宽度
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  // 高度
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  // 是否禁用
  disabled: PropTypes.bool,

  // 点击事件
  onClick: PropTypes.func,

  // 自定义类名
  className: PropTypes.string,

  // 自定义样式
  style: PropTypes.object,

  // 按钮类型
  type: PropTypes.oneOf(["button", "submit", "reset"]),
};

export default Button;

"use client";

import { useState, useCallback, useMemo, useRef, useLayoutEffect } from "react";
import styles from "./Switch.module.css";

export default function Switch({
  checked,
  defaultChecked = false,
  onChange,
  onClick,
  checkedChildren = null,
  unCheckedChildren = null,
  className = "",
  style = {},
  id,
  ...rest
}) {
  const isControlled = typeof checked === "boolean";
  const [innerChecked, setInnerChecked] = useState(defaultChecked);
  const isChecked = isControlled ? checked : innerChecked;

  const handleToggle = useCallback(
    (event) => {
      const next = !isChecked;
      if (!isControlled) setInnerChecked(next);
      onChange?.(next, event);
      onClick?.(event);
    },
    [isChecked, isControlled, onChange, onClick]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleToggle(event);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (!isControlled) setInnerChecked(false);
        onChange?.(false, event);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (!isControlled) setInnerChecked(true);
        onChange?.(true, event);
      }
    },
    [isControlled, onChange, handleToggle]
  );

  const classes = useMemo(
    () =>
      [styles.switch, isChecked ? styles.switchChecked : "", className]
        .filter(Boolean)
        .join(" "),
    [isChecked, className]
  );

  const checkedChildrenRef = useRef();
  const unCheckedChildrenRef = useRef();
  const contentRef = useRef();
  const handleRef = useRef();
  const [translateXWidth, setTranslateXWidth ] = useState();

  useLayoutEffect(() => {
    if (
      checkedChildrenRef.current &&
      unCheckedChildrenRef.current &&
      contentRef.current
    ) {
      const checkedChildrenWidth = checkedChildrenRef.current.offsetWidth;
      const unCheckedChildrenWidth = unCheckedChildrenRef.current.offsetWidth;
      const handleWidth = handleRef.current.offsetWidth;
      const maxWidth = Math.max(checkedChildrenWidth, unCheckedChildrenWidth);
      setTranslateXWidth(maxWidth)
      checkedChildrenRef.current.style.setProperty(
        "min-width",
        `${maxWidth}px`
      );
      unCheckedChildrenRef.current.style.setProperty(
        "min-width",
        `${maxWidth}px`
      );
      contentRef.current.style.setProperty(
        "width",
        `${maxWidth + handleWidth}px`
      );
    }
  }, []);

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={isChecked}
      className={classes}
      style={{ ...style, "--translateXWidth": `${translateXWidth}` }}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <div ref={contentRef} className={styles.content}>
        <div className={styles.contentInner}>
          <span
            ref={checkedChildrenRef}
            className={`${styles.text} ${styles.textOn} ${
              isChecked ? styles.textVisible : ""
            }`}
          >
            {checkedChildren}
          </span>
          <span
            ref={handleRef}
            className={styles.handle}
            aria-hidden="true"
          ></span>
          <span
            ref={unCheckedChildrenRef}
            className={`${styles.text} ${styles.textOff} ${
              !isChecked ? styles.textVisible : ""
            }`}
          >
            {unCheckedChildren}
          </span>
        </div>
      </div>
    </button>
  );
}

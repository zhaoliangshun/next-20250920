import React, { useState } from 'react';
import styles from './AnimatedSwitch.module.css';

const AnimatedSwitch = ({
    checked = false,
    onChange,
    disabled = false,
    size = 'default',
    checkedChildren,
    unCheckedChildren
}) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleClick = () => {
        if (disabled) return;

        const newChecked = !isChecked;
        setIsChecked(newChecked);

        if (onChange) {
            onChange(newChecked);
        }
    };

    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return styles.small;
            case 'large':
                return styles.large;
            default:
                return styles.default;
        }
    };

    return (
        <button 
            className={`${styles.switch} ${getSizeClass()} ${
                isChecked ? styles.checked : ''
            } ${disabled ? styles.disabled : ''}`}
            onClick={handleClick}
            disabled={disabled}
            role="switch"
            aria-checked={isChecked}
        >
            <div className={styles.handle}></div>
            <span className={`${styles.inner} ${isChecked ? styles.visible : styles.hidden}`}>
                {checkedChildren}
            </span>
            <span className={`${styles.inner} ${!isChecked ? styles.visible : styles.hidden}`}>
                {unCheckedChildren}
            </span>
        </button>
    );
};

export default AnimatedSwitch;
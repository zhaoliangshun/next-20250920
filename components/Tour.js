import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Tour.module.css';

const Tour = ({
    steps = [],
    isOpen = false,
    onClose,
    onComplete,
    currentStep = 0,
    onStepChange,
    maskClosable = true,
    showProgress = true,
    showSkip = true
}) => {
    const [activeStep, setActiveStep] = useState(currentStep);
    const [targetRect, setTargetRect] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const tooltipRef = useRef(null);

    const updateTargetPosition = useCallback(() => {
        const step = steps[activeStep];
        if (!step?.target) return;

        const targetElement = typeof step.target === 'string' 
            ? document.querySelector(step.target)
            : step.target;

        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            setTargetRect({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            });

            // Calculate tooltip position
            setTimeout(() => {
                if (tooltipRef.current) {
                    const tooltipRect = tooltipRef.current.getBoundingClientRect();
                    const position = calculateTooltipPosition(rect, tooltipRect, step.placement);
                    setTooltipPosition(position);
                }
            }, 0);
        }
    }, [activeStep, steps]);

    useEffect(() => {
        if (isOpen && steps[activeStep]) {
            updateTargetPosition();
            window.addEventListener('resize', updateTargetPosition);
            window.addEventListener('scroll', updateTargetPosition);
            
            return () => {
                window.removeEventListener('resize', updateTargetPosition);
                window.removeEventListener('scroll', updateTargetPosition);
            };
        }
    }, [isOpen, activeStep, steps, updateTargetPosition]);

    

    const calculateTooltipPosition = (targetRect, tooltipRect, placement = 'bottom') => {
        const margin = 12;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top, left;

        switch (placement) {
            case 'top':
                top = targetRect.top - tooltipRect.height - margin;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = targetRect.bottom + margin;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.left - tooltipRect.width - margin;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.right + margin;
                break;
            default:
                top = targetRect.bottom + margin;
                left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        }

        // Adjust for viewport boundaries
        if (left < margin) left = margin;
        if (left + tooltipRect.width > viewportWidth - margin) {
            left = viewportWidth - tooltipRect.width - margin;
        }
        if (top < margin) top = margin;
        if (top + tooltipRect.height > viewportHeight - margin) {
            top = viewportHeight - tooltipRect.height - margin;
        }

        return { top: top + window.scrollY, left };
    };

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            const newStep = activeStep + 1;
            setActiveStep(newStep);
            onStepChange?.(newStep);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (activeStep > 0) {
            const newStep = activeStep - 1;
            setActiveStep(newStep);
            onStepChange?.(newStep);
        }
    };

    const handleSkip = () => {
        onClose?.();
    };

    const handleComplete = () => {
        onComplete?.();
        onClose?.();
    };

    const handleMaskClick = (e) => {
        if (maskClosable && e.target === e.currentTarget) {
            onClose?.();
        }
    };

    if (!isOpen || !steps.length) return null;

    const currentStepData = steps[activeStep];
    if (!currentStepData) return null;

    return (
        <div className={styles.tourOverlay} onClick={handleMaskClick}>
            {/* Spotlight mask */}
            {targetRect && (
                <div className={styles.spotlight}>
                    <svg className={styles.spotlightSvg}>
                        <defs>
                            <mask id="spotlight-mask">
                                <rect width="100%" height="100%" fill="white" />
                                <rect
                                    x={targetRect.left}
                                    y={targetRect.top}
                                    width={targetRect.width}
                                    height={targetRect.height}
                                    rx="8"
                                    fill="black"
                                />
                            </mask>
                        </defs>
                        <rect
                            width="100%"
                            height="100%"
                            fill="rgba(0, 0, 0, 0.5)"
                            mask="url(#spotlight-mask)"
                        />
                    </svg>
                </div>
            )}

            {/* Tooltip */}
            <div
                ref={tooltipRef}
                className={styles.tooltip}
                style={{
                    top: tooltipPosition.top,
                    left: tooltipPosition.left,
                }}
            >
                <div className={styles.tooltipContent}>
                    {currentStepData.title && (
                        <h3 className={styles.tooltipTitle}>{currentStepData.title}</h3>
                    )}
                    {currentStepData.content && (
                        <div className={styles.tooltipDescription}>
                            {typeof currentStepData.content === 'string' ? (
                                <p>{currentStepData.content}</p>
                            ) : (
                                currentStepData.content
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.tooltipFooter}>
                    <div className={styles.tooltipActions}>
                        {showSkip && (
                            <button
                                className={styles.skipButton}
                                onClick={handleSkip}
                            >
                                跳过
                            </button>
                        )}
                        
                        <div className={styles.navigationButtons}>
                            {activeStep > 0 && (
                                <button
                                    className={styles.prevButton}
                                    onClick={handlePrev}
                                >
                                    上一步
                                </button>
                            )}
                            <button
                                className={styles.nextButton}
                                onClick={handleNext}
                            >
                                {activeStep === steps.length - 1 ? '完成' : '下一步'}
                            </button>
                        </div>
                    </div>

                    {showProgress && (
                        <div className={styles.progress}>
                            <span className={styles.progressText}>
                                {activeStep + 1} / {steps.length}
                            </span>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{
                                        width: `${((activeStep + 1) / steps.length) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tour;

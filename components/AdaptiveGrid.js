import styles from './AdaptiveGrid.module.css';

const AdaptiveGrid = ({ children, className = '' }) => {
  return (
    <div className={`${styles.adaptiveGrid} ${className}`}>
      {children}
    </div>
  );
};

export default AdaptiveGrid;
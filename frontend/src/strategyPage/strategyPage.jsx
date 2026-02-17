import styles from './strategyPage.module.css';

export default function StrategyPage() {
    return (
        <div className={styles.container}>
            <h1>Strategy Details</h1>
            <p>This page will display detailed information about a specific strategy, including its performance metrics, trade history, and any relevant charts or visualizations.</p>
            <p>Users can also edit or delete the strategy from this page.</p>
        </div>
    );
}
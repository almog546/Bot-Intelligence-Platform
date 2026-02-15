import styles from './Compare.module.css';

export default function Compare() {
    return (
        <div className={styles.container}>
            <h2>Compare Your Bot's Performance</h2>
            <p>Use this section to compare your bot's performance against industry benchmarks and other bots on the platform.</p>
            <p>Upload your bot's performance data and see how it stacks up in terms of response time, accuracy, and user satisfaction.</p>
        </div>
    );
}
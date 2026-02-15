import styles from './Settings.module.css';

export default function Settings() {
    return (
        <div className={styles.container}>
            <h2>Bot Settings</h2>
            <p>Configure your bot's settings here. You can adjust parameters such as response time, accuracy thresholds, and user interaction preferences.</p>
            <p>Make sure to save your changes to apply the new settings to your bot.</p>
        </div>
    );
}
import styles from './Dashboard.module.css';

export default function Dashboard() {
    return (
        <div className={styles.container}>
            <h2>Welcome to the Bot Intelligence Platform Dashboard</h2>
            <p>Here you can manage your bots, view analytics, and access various tools to enhance your bot's performance.</p>
            <p>Use the navigation menu to explore different sections of the platform.</p>
        </div>
    );
}
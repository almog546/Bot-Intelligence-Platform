import styles from './AddStrategy.module.css';

export default function AddStrategy() {
    return (
        <div className={styles.container}>
            <h2>Add a New Strategy</h2>
            <p>Upload your strategy file to enhance your bot's performance. Supported formats include .py, .js, and .txt.</p>
            <form className={styles.form}>
                <input type="file" name="strategyFile" accept=".py,.js,.txt" className={styles.fileInput} />
                <button type="submit" className={styles.submitButton}>Upload Strategy</button>
            </form>
        </div>
    );
}
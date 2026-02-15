import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();

   function handleAddStrategy() {
        navigate('/add-strategy');
    }
    return (
        <div className={styles.container}>
           <button onClick={handleAddStrategy} className={styles.addButton}>Add Strategy</button>
        </div>
    );
}
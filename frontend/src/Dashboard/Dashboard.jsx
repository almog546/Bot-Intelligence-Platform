import { use } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Dashboard() { 
    const [strategies, setStrategies] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchStrategies() {
            try {
                const res = await api.get('/api/strategies/all');
                setStrategies(res.data.strategies);
            }
            catch (err) {
                console.error('Failed to fetch strategies:', err);
            }
        }

        fetchStrategies();
    }, []);
   function handleAddStrategy() {
        navigate('/add-strategy');
    }
    return (
        <div className={styles.container}>
           <button onClick={handleAddStrategy} className={styles.addButton}>Add Strategy</button>
            <h1>Your Strategies</h1>
            {strategies.length === 0 ? (
                <p>No strategies uploaded yet.</p>
            ) : (
                strategies.map((strategy) => (
                    <div key={strategy.id} className={styles.strategyCard}>
                        <h2>{strategy.name}</h2>
                        <p>Total Trades: {strategy.totalTrades}</p>
                        <p>Net Profit: {strategy.netProfit.toFixed(2)}</p>
                        <p>Win Rate: {strategy.winRate.toFixed(2)}%</p>
                        <p>Created At: {new Date(strategy.createdAt).toLocaleDateString()}</p>
                    </div>
                ))
            )}
        </div>
    );
}
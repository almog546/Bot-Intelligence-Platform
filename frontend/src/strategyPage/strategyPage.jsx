import styles from './strategyPage.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';

export default function StrategyPage() {
     const [strategies, setStrategies] = useState([]);
     const {id} = useParams();


      useEffect(() => {
        async function fetchStrategies() {
            try {
                const res = await api.get(`/api/strategies/${id}`);
                setStrategies([res.data]);
            }
            catch (err) {
                console.error('Failed to fetch strategies:', err);
            }
        }

        fetchStrategies();
    }, [id]);
  
    
    return (
        <div className={styles.container}>
            {strategies.map(strategy => (
                <div key={strategy.id} className={styles.strategyCard}>
                    <h3>{strategy.name}</h3>
                    <p>Total Trades: {strategy.totalTrades}</p>
                     <div className={styles.tradesInfo}>
                    {strategy.trades?.length > 0 && (
                        <p>from {new Date(strategy.trades[0].date).toLocaleDateString()} to {new Date(strategy.trades.at(-1).date).toLocaleDateString()}</p>
                    )}
                    </div>
                    <p>Total Profit: ${strategy.netProfit.toFixed(2)}</p>
                    <p>Win Rate: {strategy.winRate.toFixed(2)}%</p>
                    <p>Max Drawdown: ${strategy.maxDrawdown.toFixed(2)}</p>
                   
                    
                </div>
            ))}
        </div>
    );
}
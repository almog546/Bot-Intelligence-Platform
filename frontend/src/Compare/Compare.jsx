import styles from './Compare.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Compare() {
    const [strategies, setStrategies] = useState([]);

    const [selectedStrategies, setSelectedStrategies] = useState([]);

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
    function addtocompare(strategyId) {
        if (selectedStrategies.includes(strategyId)) {
            setSelectedStrategies(selectedStrategies.filter(id => id !== strategyId));
        }
        else {
            setSelectedStrategies([...selectedStrategies, strategyId]);
        }
      
    }
  

    return (<>
        <div className={styles.container}>
            <h2>Compare Your Bot's Performance</h2>
            <div className={styles.strategyList}>
                {strategies.map(strategy => (
                    <div key={strategy.id} className={styles.strategyCard}>
                        <h3>{strategy.name}</h3>
                        <p>Total Trades: {strategy.totalTrades}</p>
                        <button onClick={() => addtocompare(strategy.id)} className={styles.compareButton}>{selectedStrategies.includes(strategy.id) ? 'Remove from Compare' : 'Add to Compare'}</button>
                    </div>
                ))}

            </div>
            <div className={styles.compareSection}>
                
                
                    <h3>Comparison Results</h3>
                    <p>Comparison data for selected strategies will be displayed here.</p>
                    <div className={styles.comparisonData}>
                        {selectedStrategies.map(id => {
                            const strategy = strategies.find(s => s.id === id);
                            return (<div key={id} className={styles.strategyComparisonCard}>
                                <h4>{strategy.name}</h4>
                                <p>Total Trades: {strategy.totalTrades}</p>
                                <p>Net Profit: ${strategy.netProfit.toFixed(2)}</p>
                                <p>Win Rate: {strategy.winRate.toFixed(2)}%</p>
                                <p>Max Drawdown: {strategy.maxDrawdown.toFixed(2)}</p>
                                
                            </div>);
                        })}
                    </div>
                
                </div>
            </div>
   </> );
}

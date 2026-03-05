import styles from './Compare.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
  
);

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
    function calculateEquityCurve(trades) {
        let equity = 10000; 
        let numberOfTrades = 0;
        const sortedTrades = trades.sort((a, b) => new Date(a.date) - new Date(b.date));
        return sortedTrades.map(trade => {
            numberOfTrades++;
            equity += Number(trade.netProfit);
            return {
                numberOfTrades,
                equity,
            };
        });
    }

    function maxNumberOfTrades() {
        return Math.max(...strategies.map(s => s.totalTrades || 0));
    }
   
    const maxTrades = maxNumberOfTrades(); 
 


     const chartData = {
        labels: Array.from({ length: maxTrades }, (_, i) => i + 1),
        datasets: selectedStrategies.map(id => {
            const strategy = strategies.find(s => s.id === id);
            const strategyTrades = strategy.trades || [];
            const equityCurve = calculateEquityCurve(strategyTrades);
            return {
                label: strategy.name,
                data: equityCurve.map(point => point.equity),
                fill: false,
                borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                tension: 0.1,
                    pointRadius: 0,
                        borderWidth: 2,
            };
        }),
    };
            
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Equity Curve Comparison',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Number of Trades',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Equity ($)',
                },
            },
        },
    };
        
       


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
                                <p style={{ color: strategy.netProfit >= 0 ? 'green' : 'red' }}>Net Profit: ${strategy.netProfit.toFixed(2)}</p>
                                <p>Win Rate: {strategy.winRate.toFixed(2)}%</p>
                                <p>Max Drawdown: {strategy.maxDrawdown.toFixed(2)}</p>
                               
                                
                                
                            </div>);
                        })}
                       
                        
                      
                    </div>
                    
                    <Line data={chartData} options={chartOptions} />
                  
                
                </div>
            </div>
   </> );
}

import styles from './strategyPage.module.css';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';

export default function StrategyPage() {
     const [strategies, setStrategies] = useState([]);
     const [simulationData, setSimulationData] = useState([]);
     const [Slippage , setSlippage] = useState('');
     const [commission, setCommission] = useState('');
     const {id} = useParams();


      useEffect(() => {
        async function fetchStrategies() {
            try {
                const res = await api.get(`/api/strategies/${id}`);
                setStrategies([res.data]);
                setSimulationData([...res.data.trades]);
                
            }
            catch (err) {
                console.error('Failed to fetch strategies:', err);
            }
        }

        fetchStrategies();
    }, [id]);
    function totalTrades() {
        return simulationData.length;
    }
    function totalProfit() {
        return simulationData.reduce((total, trade) => total + trade.netProfit, 0);
    }
    function winRate() {
        const wins = simulationData.filter(trade => trade.netProfit > 0).length;
        return simulationData.length > 0 ? (wins / simulationData.length) * 100 : 0;
    }
    function maxDrawdown() {
        let peak = -Infinity;
        let maxDD = 0;
        let equity = 0;

        for (const trade of simulationData) {
            equity += trade.netProfit;
            if (equity > peak) peak = equity;
            const drawdown = peak - equity;
            if (drawdown > maxDD) maxDD = drawdown;
        }
        return maxDD;
    }
  
    function commissionSlippage() {
        
        const simulatedtrades = simulationData.map(trade => ({
            ...trade,
            netProfit: trade.netProfit - commission - Slippage,
        }));
        setSimulationData(simulatedtrades);
    }
    function resetSimulation() {
        setSimulationData([...strategies[0].trades]);
    }
  
    
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
            <div className={styles.simulation}>
            <h1>Simulation Settings</h1>
            <form action="" className={styles.simulationForm} onSubmit={(e) => {
                e.preventDefault();
                commissionSlippage();
            }}>
            <label className={styles.inputLabel}>Commission per Trade ($):
                <input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(Number(e.target.value))}
                    className={styles.input}
                />
            </label>
            <label className={styles.inputLabel}>Slippage per Trade ($):
                <input
                    type="number"
                    value={Slippage}
                    onChange={(e) => setSlippage(Number(e.target.value))}
                    className={styles.input}
                />
            </label>
            <button type="submit" className={styles.simulateButton}>Simulate</button>
            </form>
            <div className={styles.simulationResults}>
            <h2>Simulation Results</h2>
            <p>Total Trades: {totalTrades()}</p>
            <p>Total Profit: ${totalProfit().toFixed(2)}</p>
            <p>Win Rate: {winRate().toFixed(2)}%</p>
            <p>Max Drawdown: ${maxDrawdown().toFixed(2)}</p>
            </div>
            <button className={styles.resetButton} onClick={resetSimulation}>Reset Simulation</button>
            
         
            </div>
        </div>
    );
}

import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useState } from 'react';



export default function Navbar({ onLogout }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    function toggleMobileMenu() {
        setMobileMenuOpen(!mobileMenuOpen);
    }
    return (
        <nav className={styles.navbar}>
            
            <Link to="/" className={styles.logo}>AlgoScope</Link>
            <div className={styles.links}>
                <Link to="/" className={styles.link}>Dashboard</Link>
                <Link to="/compare" className={styles.link}>Compare</Link>
                <Link to="/settings" className={styles.link}>Settings</Link>
                <button onClick={onLogout} className={styles.logoutButton}>Logout</button>
            </div>
            <div className={styles.mobileMenu}>
                <div className={styles.mobileMenuIcon} onClick={toggleMobileMenu}>☰</div>
                {mobileMenuOpen && (
                    <div className={styles.mobileMenuContent}>
                        <Link to="/" className={styles.mobileLink} >Dashboard</Link>
                        <Link to="/compare" className={styles.mobileLink} >Compare</Link>
                        <Link to="/settings" className={styles.mobileLink} >Settings</Link>
                        <button onClick={onLogout} className={styles.mobileLogoutButton}>Logout</button>
                    </div>
                )}
            </div>
            
            

            
        </nav>
    );
}
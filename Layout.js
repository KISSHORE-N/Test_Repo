import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './CommonStyles.css';
import { initialNotifications } from './SubscriberDashboard'; // Import notifications for the badge

// --- Minimal Icon Components ---
const NotificationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

// Hardcoded user info for the header
const subscriber = {
    name: 'Lucifer',
    email: 'lucifer@gmail.com',
};

function Layout() {
    // STATE IS MANAGED HERE
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();
    const notificationCount = initialNotifications.length;

    // TOGGLE FUNCTION IS DEFINED HERE
    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
        console.log("Notification icon toggled in Layout.");
    };

    return (
        <div className="app-container">
            {/* --- NAVBAR / HEADER --- */}
            <header className="main-header">
                <div className="logo-section" onClick={() => navigate('/')}>
                    <img src="/path/to/standard-chartered-logo.svg" alt="Standard Chartered Logo" className="sc-logo" />
                </div>
                <div className="user-profile">
                    <h1 className="user-name">{subscriber.name}</h1>
                    <p className="user-email">{subscriber.email}</p>
                </div>
                
                {/* --- NOTIFICATION ICON TOGGLE (Controls Layout state) --- */}
                <button 
                    className={`notification-toggle-button ${showNotifications ? 'active' : ''}`}
                    onClick={toggleNotifications} // <--- Calls the Layout's toggle
                    title={showNotifications ? "Hide Notifications" : "Show Notifications"}
                >
                    {showNotifications ? <CloseIcon /> : <NotificationIcon />}
                    {notificationCount > 0 && (
                        <span className="notification-badge">{notificationCount}</span>
                    )}
                </button>
            </header>

            {/* --- MAIN CONTENT AREA: Pass state/setter via context --- */}
            <Outlet context={{ showNotifications, toggleNotifications }} /> {/* <--- PASSING CONTEXT */}
        </div>
    );
}

export default Layout;
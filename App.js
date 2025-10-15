import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/common/Layout';
import SubscriberDashboard from './components/common/SubscriberDashboard';
import SubscriberDownloadPage from './components/Subscriberdown/SubscriberDownloadPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Default route: Subscriber Group Management */}
                    <Route index element={<SubscriberDashboard />} />
                    
                    {/* New route for the Reports/Download Page */}
                    <Route path="reports" element={<SubscriberDownloadPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
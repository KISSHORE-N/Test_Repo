import React, { useMemo, useState } from 'react';
import '../../components/common/CommonStyles.css';
// Local CSS import for isolated styles
import './SubscriberDownloadPage.css';
// Import common icons (assuming they are globally accessible or moved to a common utility file)

// Icons (redefined locally for isolated component functionality)
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);

// --- Data Generation ---
const generateInitialReports = () => {
    const reports = [];
    const statuses = ['Processed', 'Pending', 'Failed'];
    const descriptions = [
        'Detailed quarterly financial summary for Q1.',
        'Operations efficiency report focused on logistical improvements.',
        'Compliance audit results and recommendation findings.',
        'Market analysis report detailing regional sector performance.',
        'Customer feedback synthesis and service improvement plan.',
        'Risk assessment for Q3 investments and mitigation strategies.'
    ];

    for (let i = 1; i <= 100; i++) {
        const day = String(i % 28 + 1).padStart(2, '0');
        const month = String((i % 12) + 1).padStart(2, '0');
        const year = 2024;
        
        reports.push({
            id: i,
            rname: `Operations Report ${i}`,
            description: descriptions[i % descriptions.length],
            date: `${year}-${month}-${day}`, // YYYY-MM-DD format for input[type="date"]
            status: statuses[i % statuses.length],
            url: `/reports/report${i}.pdf`, 
            selected: false
        });
    }
    return reports;
};

function SubscriberDownloadPage() { // Renamed function
    const initialReports = useMemo(generateInitialReports, []);
    
    // State for the master list of reports (with selection status)
    const [reports, setReports] = useState(initialReports);

    // States for the date filter inputs (what the user types)
    const [inputFromDate, setInputFromDate] = useState('');
    const [inputToDate, setInputToDate] = useState('');
    
    // States for the active date filters (applied on search/clear)
    const [filterFromDate, setFilterFromDate] = useState('');
    const [filterToDate, setFilterToDate] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'from') {
            setInputFromDate(value);
        } else if (name === 'to') {
            setInputToDate(value);
        }
    };

    const handleSearch = () => {
        setFilterFromDate(inputFromDate);
        setFilterToDate(inputToDate);
    };

    const handleClearFilters = () => {
        setInputFromDate('');
        setInputToDate('');
        setFilterFromDate('');
        setFilterToDate('');
    };

    const handleSelect = (id) => {
        setReports(prevReports =>
            prevReports.map(report =>
                report.id === id ? { ...report, selected: !report.selected } : report
            )
        );
    };
    
    // --- Filtering Logic ---
    const from = filterFromDate ? new Date(filterFromDate) : null;
    const to = filterToDate ? new Date(filterToDate) : null;

    if (to) {
        to.setHours(23, 59, 59, 999);
    }

    const filteredReports = reports.filter(function(report) {
        if (!from && !to) return true; 

        const reportDate = new Date(report.date);
        
        if (isNaN(reportDate.getTime())) return false; 
        
        const isAfterFrom = from ? reportDate >= from : true;
        const isBeforeTo = to ? reportDate <= to : true;
        
        return isAfterFrom && isBeforeTo;
    });

    // --- Select All Logic ---
    const selectedCount = filteredReports.filter(r => r.selected).length;
    const allFilteredSelected = selectedCount === filteredReports.length && filteredReports.length > 0;
    const isIndeterminate = selectedCount > 0 && selectedCount < filteredReports.length;

    const handleSelectAll = (event) => {
        const checked = event.target.checked;
        setReports(prevReports => 
            prevReports.map(report => {
                const isFiltered = filteredReports.some(r => r.id === report.id);

                if (isFiltered) {
                    return { ...report, selected: checked };
                }
                return report;
            })
        );
    };
    
    // Fallback URL for download ZIP if needed
    const handleDownloadZip = () => {
        const count = reports.filter(r => r.selected).length;
        if (count > 0) {
            console.log(`Downloading ${count} selected files in ZIP format...`);
            alert(`Initiating download for ${count} selected reports.`);
        } else {
            alert("Please select reports to download.");
        }
    };


    return (
        // Note: Removing the 'app-container' and 'header' divs as they are in Layout.js
        <div className="download-page-wrapper">
            <div className="dashboard-content">
                
                {/* --- TOP FILTER BAR --- */}
                <div className="top-filter-bar">
                    <div className="filter-card-content">
                        
                        <div className="form-group">
                            <label htmlFor="from">Select from date</label>
                            <input 
                                type="date" 
                                name="from" 
                                id="from" 
                                value={inputFromDate} 
                                onChange={handleInputChange} 
                                className="date-input"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="to">Select to date</label>
                            <input 
                                type="date" 
                                name="to" 
                                id="to" 
                                value={inputToDate} 
                                onChange={handleInputChange} 
                                className="date-input"
                            />
                        </div>
                        
                        {/* Search Button */}
                        <button 
                            className="action-button filter-search-button" 
                            onClick={handleSearch}
                        >
                            Search Files
                        </button>

                        {/* Clear Filters Button */}
                        <button 
                            className="action-button clear-filter-button" 
                            onClick={handleClearFilters}
                            disabled={!inputFromDate && !inputToDate && !filterFromDate && !filterToDate}
                        >
                            <ClearIcon />
                            Clear Filters
                        </button>
                    </div>

                    {/* --- DOWNLOAD ZIP ACTION --- */}
                    <div className="download-action-content">
                        <button 
                            className="action-button secondary-button"
                            onClick={handleDownloadZip}
                            disabled={reports.filter(r => r.selected).length === 0}
                        >
                            <DownloadIcon />
                            Download Selected Files (ZIP) ({reports.filter(r => r.selected).length})
                        </button>
                    </div>
                </div>

                {/* --- REPORTS TABLE AREA --- */}
                <div className="main-reports-area reports-area">
                    <h2 className="report-title">Filtered Reports ({filteredReports.length} found)</h2>
                    
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '4%' }}>
                                        <input 
                                            type="checkbox" 
                                            className="select-checkbox" 
                                            checked={allFilteredSelected}
                                            ref={input => {
                                                if (input) {
                                                    input.indeterminate = isIndeterminate;
                                                }
                                            }}
                                            onChange={handleSelectAll}
                                            disabled={filteredReports.length === 0}
                                        />
                                    </th>
                                    <th style={{ width: '15%' }}>Report Name</th>
                                    <th style={{ width: '35%' }}>Description</th>
                                    <th style={{ width: '10%' }}>Report Date</th>
                                    <th style={{ width: '10%' }}>Status</th>
                                    <th style={{ width: '10%' }}>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <tr key={report.id}>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    checked={report.selected} 
                                                    onChange={() => handleSelect(report.id)} 
                                                    className="select-checkbox"
                                                />
                                            </td>
                                            <td>{report.rname}</td>
                                            <td>
                                                <p className="report-description">{report.description}</p>
                                            </td>
                                            <td>{report.date}</td>
                                            <td>
                                                <span className={`status-tag status-${report.status.toLowerCase()}`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td>
                                                <a 
                                                    href={report.url} 
                                                    download={`Report-${report.id}.pdf`} 
                                                    className="action-link"
                                                >
                                                    Download PDF
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-reports">No reports found matching the criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubscriberDownloadPage;
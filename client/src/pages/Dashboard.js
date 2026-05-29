import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/items');
                setItems(res.data);
            } catch (err) {
                console.error("Error fetching items");
            }
        };
        fetchItems();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const filteredItems = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleContact = (item) => {
        const email = item.reportedBy?.email;
        if (!email) {
            alert("Contact information not available.");
            return;
        }
        const subject = encodeURIComponent(`Campus Portal: Regarding ${item.title}`);
        window.location.href = `mailto:${email}?subject=${subject}`;
    };

    // Helper for date formatting
    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div style={containerStyle}>
            <nav style={navStyle}>
                <h2 style={logoStyle} onClick={() => navigate('/dashboard')}>
                    🎓 Campus Portal
                </h2>
                <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                    <button onClick={() => navigate('/my-reports')} style={myReportsBtnStyle}>
                        👤 My Profile
                    </button>
                    <button onClick={() => navigate('/report')} style={reportBtn}>
                        + Report Item
                    </button>
                    <button onClick={handleLogout} style={logoutBtn}>Logout</button>
                </div>
            </nav>

            <div style={contentStyle}>
                <div style={headerSection}>
                    <h3 style={sectionHeadingStyle}>Recent Lost & Found Items</h3>
                    <input 
                        type="text" 
                        placeholder="Search items..." 
                        style={searchStyle}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={gridStyle}>
                    {filteredItems.length > 0 ? filteredItems.map(item => (
                        <div key={item._id} style={itemCard}>
                            {item.image ? (
                                <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.title} style={imageStyle} />
                            ) : (
                                <div style={noImageStyle}>No Image</div>
                            )}
                            <div style={badgeStyle(item.status)}>{item.status}</div>
                            <h4 style={itemTitleStyle}>{item.title}</h4>
                            <p style={descStyle}>{item.description}</p>
                            
                            {/* --- Location and Date Row --- */}
                            <div style={infoRow}>
                                <div style={locStyle}>📍 {item.location}</div>
                                <div style={dateStyle}>📅 {formatDate(item.createdAt)}</div>
                            </div>
                            
                            <button onClick={() => handleContact(item)} style={contactBtnStyle}>
                                ✉️ Contact Reporter
                            </button>
                        </div>
                    )) : (
                        <p style={{textAlign: 'center', gridColumn: '1/-1', color: '#94a3b8'}}>No items found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Styles (Updated with infoRow & dateStyle) ---
const containerStyle = { fontFamily: "'Inter', sans-serif", backgroundColor: '#0f172a', minHeight: '100vh', color: '#f1f5f9' };
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 50px', backgroundColor: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 1000, borderBottom: '1px solid #334155' };
const logoStyle = { color: '#56f213', margin: 0, cursor: 'pointer', fontWeight: '800' };
const myReportsBtnStyle = { padding: '10px 18px', backgroundColor: '#ffffffb4', color: '#000', border: '1px solid #38bdf8', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' };
const reportBtn = { padding: '10px 18px', backgroundColor: '#56f213', color: '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' };
const logoutBtn = { padding: '10px 18px', backgroundColor: 'red', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };
const contentStyle = { padding: '30px 50px' };
const headerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' };
const sectionHeadingStyle = { fontSize: '22px', fontWeight: '700', color: '#f8fafc' };
const searchStyle = { padding: '12px 20px', width: '320px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', outline: 'none' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' };
const itemCard = { backgroundColor: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', border: '1px solid #334155' };
const imageStyle = { width: '100%', height: '170px', objectFit: 'cover', borderRadius: '12px' };
const noImageStyle = { width: '100%', height: '170px', backgroundColor: '#334155', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' };
const itemTitleStyle = { marginTop: '15px', color: '#000', fontSize: '18px', fontWeight: '700' };
const descStyle = { fontSize: '14px', color: '#64748b', margin: '10px 0', flexGrow: 1, lineHeight: '1.5' };

const infoRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };
const locStyle = { fontSize: '13px', color: '#38bdf8', fontWeight: '600' };
const dateStyle = { fontSize: '11px', color: '#94a3b8', fontWeight: '500' };

const contactBtnStyle = { marginTop: '10px', padding: '12px', backgroundColor: '#58e95d', color: '#000', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700' };
const badgeStyle = (status) => ({ marginTop: '10px', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', width: 'fit-content', textTransform: 'uppercase', backgroundColor: status === 'Lost' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: status === 'Lost' ? '#fb7185' : '#34d399', border: `1px solid ${status === 'Lost' ? '#fb7185' : '#34d399'}` });

export default Dashboard;
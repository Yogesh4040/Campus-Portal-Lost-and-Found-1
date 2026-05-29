import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState({ name: '', email: '' });
    const [userItems, setUserItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const res = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.user);
            setUserItems(res.data.items || []);
        } catch (err) {
            showToast("❌ Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    // --- NEW: Resolve Functionality ---
    const resolveItem = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/items/${itemId}/resolve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state to show 'Resolved' status instantly
            setUserItems(userItems.map(item => 
                item._id === itemId ? { ...item, status: 'Resolved' } : item
            ));
            showToast("✅ Item marked as resolved!");
        } catch (err) {
            showToast("❌ Failed to resolve item");
        }
    };

    const deleteItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this report?")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/items/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUserItems(userItems.filter(item => item._id !== itemId));
            showToast("🗑️ Report deleted successfully");
        } catch (err) {
            showToast("❌ Could not delete item");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <div style={containerStyle}><p>Loading Profile...</p></div>;

    return (
        <div style={containerStyle}>
            {toast && <div style={toastStyle}>{toast}</div>}

            <nav style={navStyle}>
                <h2 style={logoStyle} onClick={() => navigate('/dashboard')}>🎓 My Activites</h2>
                <button onClick={() => navigate('/dashboard')} style={backBtn}>← Back to Dashboard</button>
            </nav>

            <div style={contentStyle}>
                <div style={profileCard}>
                    <div style={avatarSection}>
                        <div style={avatarCircle}>
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h3 style={userName}>{user.name}</h3>
                        <p style={userEmail}>{user.email}</p>
                        <span style={badge}>Verified</span>
                    </div>

                    <div style={statsRow}>
                        <div style={statBox}>
                            <span style={statVal}>{userItems.length}</span>
                            <span style={statLabel}>Reports</span>
                        </div>
                        <div style={statBox}>
                            {/* Dynamically count resolved items */}
                            <span style={statVal}>
                                {userItems.filter(item => item.status === 'Resolved').length}
                            </span>
                            <span style={statLabel}>Resolved</span>
                        </div>
                    </div>

                    <div style={{ padding: '20px' }}>
                        <h4 style={sectionTitle}>Your Active Reports</h4>
                        {userItems.length > 0 ? (
                            userItems.map(item => (
                                <div key={item._id} style={itemSmallCard}>
                                    <div style={{ flex: 1 }}>
                                        <div style={itemTitle}>{item.title}</div>
                                        <div style={itemMeta}>{item.location} • {item.status}</div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {/* Resolve Button - Only shows if status is not 'Resolved' */}
                                        {item.status !== 'Resolved' && (
                                            <button 
                                                onClick={() => resolveItem(item._id)} 
                                                style={resolveBtnStyle}
                                                title="Mark as Resolved"
                                            >
                                                Resolved?
                                            </button>
                                        )}

                                        <button 
                                            onClick={() => deleteItem(item._id)} 
                                            style={deleteBtnStyle}
                                            title="Delete Report"
                                        >
                                            🗑️
                                        </button>
                                    </div>

                                    <span style={
                                        item.status === 'Lost' ? statusLost : 
                                        item.status === 'Found' ? statusFound : statusResolved
                                    }>
                                        {item.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#64748b', fontSize: '12px' }}>No items reported yet.</p>
                        )}
                    </div>

                    <div style={actionArea}>
                        <button onClick={() => navigate('/report')} style={actionBtn}>+ Report New Item</button>
                        <button onClick={handleLogout} style={logoutBtn}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- ✨ Styles ---

const containerStyle = { fontFamily: "'Inter', sans-serif", backgroundColor: '#0f172a', minHeight: '100vh', color: '#f1f5f9' };
const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 30px', backgroundColor: '#1e293b', borderBottom: '1px solid #334155' };
const logoStyle = { color: '#56f213', margin: 0, cursor: 'pointer', fontSize: '1.2rem', fontWeight: '800' };
const backBtn = { padding: '6px 14px', backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' };
const contentStyle = { padding: '40px 20px', display: 'flex', justifyContent: 'center' };
const profileCard = { backgroundColor: '#1e293b', borderRadius: '24px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)', border: '1px solid #334155', overflow: 'hidden' };
const avatarSection = { padding: '30px 20px', textAlign: 'center', background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1px solid #334155' };
const avatarCircle = { width: '80px', height: '80px', backgroundColor: '#56f213', color: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '800', margin: '0 auto 15px auto', boxShadow: '0 0 20px rgba(86, 242, 19, 0.3)' };
const userName = { margin: '0', color: '#ffffff', fontSize: '1.5rem', fontWeight: '700' };
const userEmail = { color: '#94a3b8', fontSize: '14px', marginTop: '4px' };
const badge = { display: 'inline-block', marginTop: '12px', padding: '4px 12px', backgroundColor: 'rgba(86, 242, 19, 0.1)', color: '#56f213', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' };
const statsRow = { display: 'flex', borderBottom: '1px solid #334155' };
const statBox = { flex: 1, padding: '15px', textAlign: 'center', borderRight: '1px solid #334155' };
const statVal = { display: 'block', fontSize: '18px', fontWeight: '800', color: '#ffffff' };
const statLabel = { fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' };
const sectionTitle = { fontSize: '13px', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '15px' };
const itemSmallCard = { display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#0f172a', borderRadius: '12px', marginBottom: '10px', border: '1px solid #334155' };
const itemTitle = { fontSize: '14px', fontWeight: '600', color: '#fff' };
const itemMeta = { fontSize: '11px', color: '#64748b' };

const statusLost = { fontSize: '10px', color: '#ef4444', fontWeight: '700' };
const statusFound = { fontSize: '10px', color: '#56f213', fontWeight: '700' };
const statusResolved = { fontSize: '10px', color: '#94a3b8', fontWeight: '700' };

const actionArea = { padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' };
const actionBtn = { padding: '12px', backgroundColor: '#56f213', color: '#0f172a', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' };
const logoutBtn = { padding: '12px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' };
const toastStyle = { position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1e293b', color: '#56f213', padding: '12px 24px', borderRadius: '12px', zIndex: 2000, border: '1px solid #56f213' };

const deleteBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '5px',
    borderRadius: '6px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const resolveBtnStyle = {
    padding: '5px 10px',
    backgroundColor: '#56f213',
    color: '#0f172a',
    border: 'none',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '800',
    cursor: 'pointer',
    textTransform: 'uppercase'
};

export default Profile;
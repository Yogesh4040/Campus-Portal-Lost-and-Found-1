import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReportItem = () => {
    const [item, setItem] = useState({ title: '', description: '', location: '', status: 'Lost' });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            return payload.id || payload._id;
        } catch (e) {
            return null;
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = getUserIdFromToken();
        
        if (!userId) {
            alert("Please login again to report an item.");
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('title', item.title);
        formData.append('description', item.description);
        formData.append('location', item.location);
        formData.append('status', item.status);
        formData.append('reportedBy', userId);
        
        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/items/add', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` 
                }
            });
            alert("Item Reported Successfully!");
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Failed to report item");
        }
    };

    return (
        <div style={containerStyle}>
            {/* --- Navigation Bar --- */}
            <nav style={navStyle}>
                <h2 style={logoStyle} onClick={() => navigate('/dashboard')}>
                    🎓 Campus Portal
                </h2>
                <button onClick={() => navigate('/dashboard')} style={backBtn}>
                    ← Back to Dashboard
                </button>
            </nav>

            <div style={contentStyle}>
                <div style={formCard}>
                    <h2 style={formTitle}>📢 Report New Item</h2>
                    <p style={subtitle}>Fill in the details to help the community.</p>

                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Item Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Blue Wallet, iPhone 13" 
                                style={inputStyle} 
                                onChange={(e) => setItem({...item, title: e.target.value})} 
                                required 
                            />
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Where did you find/lose it?</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Library 2nd Floor, Main Cafe" 
                                style={inputStyle} 
                                onChange={(e) => setItem({...item, location: e.target.value})} 
                                required 
                            />
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Type of Report</label>
                            <select 
                                style={inputStyle} 
                                value={item.status}
                                onChange={(e) => setItem({...item, status: e.target.value})}
                            >
                                <option value="Lost">I Lost This (Lost)</option>
                                <option value="Found">I Found This (Found)</option>
                            </select>
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Description</label>
                            <textarea 
                                placeholder="Mention colors, marks, or specific details..." 
                                style={{...inputStyle, minHeight: '100px', resize: 'vertical'}} 
                                onChange={(e) => setItem({...item, description: e.target.value})} 
                                required 
                            />
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Item Photo (Optional)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                style={fileInputStyle} 
                                onChange={handleImageChange} 
                            />
                        </div>

                        {preview && (
                            <div style={previewContainer}>
                                <img src={preview} alt="Preview" style={previewImage} />
                            </div>
                        )}

                        <button type="submit" style={submitBtn}>Submit Report</button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/dashboard')} 
                            style={cancelBtn}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- ✨ High-Contrast Dark Theme Styles ---

const containerStyle = { 
    fontFamily: "'Inter', sans-serif", 
    backgroundColor: '#0f172a', 
    minHeight: '100vh',
    color: '#f1f5f9'
};

const navStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '15px 50px', 
    backgroundColor: '#1e293b', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    borderBottom: '1px solid #334155'
};

const logoStyle = { color: '#56f213', margin: 0, cursor: 'pointer', fontWeight: '800' };

const backBtn = { 
    padding: '10px 18px', 
    backgroundColor: '#ffffffb4', 
    color: '#000', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: '700' 
};

const contentStyle = { 
    padding: '50px 20px', 
    display: 'flex', 
    justifyContent: 'center' 
};

const formCard = { 
    backgroundColor: '#ffffff', // Consistent white card
    padding: '40px', 
    borderRadius: '20px', 
    width: '100%', 
    maxWidth: '500px', 
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    border: '1px solid #334155'
};

const formTitle = { color: '#0f172a', margin: '0 0 5px 0', fontSize: '24px', fontWeight: '800' };
const subtitle = { color: '#64748b', fontSize: '14px', marginBottom: '25px' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };

const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' };

const labelStyle = { fontSize: '13px', fontWeight: '700', color: '#1e293b' };

const inputStyle = { 
    padding: '12px 15px', 
    borderRadius: '10px', 
    border: '2px solid #e2e8f0', 
    fontSize: '15px', 
    outline: 'none',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    transition: 'border-color 0.2s'
};

const fileInputStyle = {
    fontSize: '13px',
    color: '#64748b'
};

const previewContainer = { 
    width: '100%', 
    height: '150px', 
    borderRadius: '12px', 
    overflow: 'hidden',
    border: '2px dashed #cbd5e1'
};

const previewImage = { width: '100%', height: '100%', objectFit: 'cover' };

const submitBtn = { 
    padding: '15px', 
    backgroundColor: '#56f213', 
    color: '#0f172a', 
    border: 'none', 
    borderRadius: '10px', 
    fontSize: '16px', 
    fontWeight: '800', 
    cursor: 'pointer',
    transition: 'transform 0.1s active'
};

const cancelBtn = { 
    background: 'none', 
    border: 'none', 
    color: '#94a3b8', 
    cursor: 'pointer', 
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'underline'
};

export default ReportItem;
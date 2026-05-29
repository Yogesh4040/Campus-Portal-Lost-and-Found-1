import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            showToast("✅ Login Successful!");
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            showToast("❌ " + (err.response?.data?.message || "Invalid Credentials"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            {/* Toast Notification */}
            {toast && <div style={toastStyle}>{toast}</div>}

            <div style={formCard}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={logoStyle}>🎓 Campus Portal</h2>
                    <p style={subtitle}>Securely login to your account</p>
                </div>
                
                <form onSubmit={handleLogin} style={formStyle}>
                    <div style={inputGroup}>
                        <label style={labelStyle}>College Email</label>
                        <input 
                            type="email" 
                            placeholder="name@college.edu" 
                            style={inputStyle} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div style={inputGroup}>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                style={inputStyle} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            <span 
                                onClick={() => setShowPassword(!showPassword)} 
                                style={toggleIconStyle}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>
                        </div>
                    </div>
                    
                    <button type="submit" style={submitBtn} disabled={loading}>
                        {loading ? "Authenticating..." : "Login"}
                    </button>
                </form>

                <p style={footerStyle}>
                    New to the portal? <span onClick={() => navigate('/register')} style={linkStyle}>Create account</span>
                </p>
            </div>
        </div>
    );
};

// --- ✨ High-Contrast Dark Theme Styles ---

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0f172a', // Deep Navy Background
    fontFamily: "'Inter', sans-serif",
    padding: '20px'
};

const toastStyle = {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1e293b',
    color: '#56f213',
    padding: '12px 24px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    border: '1px solid #56f213',
    fontWeight: '700',
    fontSize: '14px',
    zIndex: 2000
};

const formCard = {
    backgroundColor: '#1e293b', // Slightly lighter navy card
    padding: '40px 30px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    width: '100%',
    maxWidth: '360px',
    border: '1px solid #334155',
    textAlign: 'center'
};

const logoStyle = {
    margin: '0',
    color: '#56f213', // Neon Green Logo
    fontSize: '24px',
    fontWeight: '800'
};

const subtitle = {
    color: '#94a3b8',
    marginTop: '8px',
    fontSize: '14px'
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
};

const inputGroup = {
    textAlign: 'left'
};

const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#cbd5e1',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    paddingRight: '45px',
    borderRadius: '10px',
    border: '1px solid #334155',
    fontSize: '15px',
    backgroundColor: '#0f172a',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
};

const toggleIconStyle = {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '18px',
    userSelect: 'none',
    opacity: '0.7'
};

const submitBtn = {
    backgroundColor: '#56f213',
    color: '#0f172a',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'transform 0.1s active'
};

const footerStyle = {
    marginTop: '25px',
    fontSize: '13px',
    color: '#94a3b8'
};

const linkStyle = {
    color: '#56f213',
    cursor: 'pointer',
    fontWeight: '700',
    textDecoration: 'none',
    marginLeft: '5px'
};

export default Login;
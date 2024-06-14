import React, { useState } from 'react';
import '../style/SignUp.css'; // Import the CSS file for styling
import axios from 'axios';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('http://localhost:8888/signup', {
                username,
                fullName,
                password,
                role: 'User' // Defaulting role to 'User'
            });

            setMessage(response.data);
        } catch (err) {
            if (err.response) {
                setError(err.response.data);
            } else {
                setError('Error signing up');
            }
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Đăng Ký</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tên Đăng Nhập:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Họ và Tên:</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật Khẩu:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}
                    <button type="submit" className="btn-submit">Đăng Ký</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;

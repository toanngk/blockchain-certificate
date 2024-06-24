import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/SignIn.css';

const SignIn = ({ handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('http://localhost:8080/signin', {
                username: username,
                password: password
            });

            setMessage(response.data.message);
            handleLogin(username, password);
            navigate('/search');
        } catch (err) {
            if (err.response) {
                setError(err.response.data);
            } else {
                setError('Error signing in');
            }
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-form">
                <h2>Đăng Nhập</h2>
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
                    <button type="submit" className="btn-submit">Đăng Nhập</button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;

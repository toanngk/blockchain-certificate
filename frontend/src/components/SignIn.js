import React, { useState } from 'react';
import '../style/SignIn.css'; // Import the CSS file for styling

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Thêm logic đăng nhập ở đây
    };

    return (
        <div className="signin-container">
            <div className="signin-form">
                <h2>Đăng Nhập</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <button type="submit" className="btn-submit">Đăng Nhập</button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;

import React, { useState } from 'react';
import '../style/SignUp.css'; // Import the CSS file for styling

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Thêm logic đăng ký ở đây
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Đăng Ký</h2>
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
                    <button type="submit" className="btn-submit">Đăng Ký</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;

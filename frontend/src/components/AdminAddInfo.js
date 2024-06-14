import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/AdminAddInfo.css';

const AdminAddInfo = ({ userRole }) => { // Receive userRole as prop
    const [name, setName] = useState('');
    const [certificateId, setCertificateId] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Thêm logic thêm thông tin ở đây
    };

    if (userRole !== 'Admin') {
        // Redirect user if not an admin
        navigate('/'); // Redirect to home or another route
        return null; // Return null to prevent rendering anything
    }

    return (
        <div className="admin-addinfo-container">
            <div className="admin-addinfo-form">
                <h2>Thêm Thông Tin Chứng Chỉ</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tên:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Số Chứng Chỉ:</label>
                        <input
                            type="text"
                            value={certificateId}
                            onChange={(e) => setCertificateId(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Ngày Cấp:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Trạng Thái:</label>
                        <input
                            type="text"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn-submit">Thêm</button>
                </form>
            </div>
        </div>
    );
};

export default AdminAddInfo;

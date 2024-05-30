import React, { useState } from 'react';

const AdminAddInfo = () => {
    const [name, setName] = useState('');
    const [certificateId, setCertificateId] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Thêm logic thêm thông tin ở đây
    };

    return (
        <div>
            <h2>Thêm Thông Tin Chứng Chỉ</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tên:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Số Chứng Chỉ:</label>
                    <input 
                        type="text" 
                        value={certificateId} 
                        onChange={(e) => setCertificateId(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Ngày Cấp:</label>
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Trạng Thái:</label>
                    <input 
                        type="text" 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                    />
                </div>
                <button type="submit">Thêm</button>
            </form>
        </div>
    );
};

export default AdminAddInfo;

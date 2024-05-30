import React, { useState } from 'react';
import axios from 'axios';

const EXPRESS_API_URL = 'http://localhost:8080';

const Test = () => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [course, setCourse] = useState('');
    const [grade, setGrade] = useState('');
    const [issuer, setIssuer] = useState('');
    const [issuedDate, setIssuedDate] = useState('');
    const [chain, setChain] = useState('');
    const [addedBlock, setAddedBlock] = useState('');
    const [addMessage, setAddMessage] = useState('');
    const [validateMessage, setValidateMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            id: Number(id),
            name: name,
            course: course,
            grade: Number(grade),
            issuer: issuer,
            issuedDate: issuedDate
        };
        axios.post(`${EXPRESS_API_URL}/add`, data)
            .then((res) => {
                console.log(res);
                setAddMessage(res.data.message);
            });
    };
    const handleValidate = (e) => {
        axios.get(`${EXPRESS_API_URL}/validate`)
            .then((res) => {
                console.log(res);
                setValidateMessage(res.data.message);
                if (res.data.addedBlock) {
                    setAddedBlock(res.data.addedBlock);
                }
            });
    };

    const handleGetChain = (e) => {
        axios.get(`${EXPRESS_API_URL}/chain`)
            .then((res) => {
                console.log(res);
                setChain(res.data);
            });
    };

    const renderObject = (obj) => {
        return (
            // return Object.entries(obj).map(([key, value]) => (
            <pre style={{ marginBottom: '10px', textAlign: 'left', textWrap: 'wrap', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                {/* <div key={key} style={{ marginBottom: '10px', textAlign: 'left', textWrap: 'wrap', wordWrap: 'break-word', wordBreak: 'break-all' }}>
                    <strong>{key}:</strong> {typeof value === 'object' ? renderObject(value) : value}
                </div> */}
                {JSON.stringify(obj, null, 2)}
            </pre>
            // ));
        );
    };

    return (
        <div>
            <div>
                <h2>Test Add</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>ID:</label>
                        <input
                            type="number"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Tên:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Chuyên ngành/Khoá học:</label>
                        <input
                            type="text"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Điểm:</label>
                        <input
                            type="number"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Người cấp:</label>
                        <input
                            type="text"
                            value={issuer}
                            onChange={(e) => setIssuer(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Ngày cấp:</label>
                        <input
                            type="date"
                            value={issuedDate}
                            onChange={(e) => setIssuedDate(e.target.value)}
                        />
                    </div>
                    <button type="submit">Thêm</button>
                </form>
                <h3>{addMessage}</h3>
            </div>
            <div>
                <button onClick={handleValidate}>Test Validate</button>
                <button onClick={handleGetChain}>Test Get Chain</button>
            </div>
            <div>
                <h2>New Block:</h2>
                <h3>{validateMessage}</h3>
                {addedBlock ? (
                    renderObject(addedBlock)
                    // JSON.stringify(addedBlock, null, 2)
                ) : (
                    <p>Added block will be shown here</p>
                )}
                <h2>Chain:</h2>
                {chain ? (
                    renderObject(chain)
                    // JSON.stringify(chain, null, 2)
                ) : (
                    <p>Blockchain will be shown here</p>
                )}
            </div>
        </div>
    );
};

export default Test;

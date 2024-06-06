import React, { useState } from 'react';
import axios from 'axios';
import '../style/Test.css'; // Import the CSS file for styling

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

    const handleValidate = () => {
        axios.get(`${EXPRESS_API_URL}/validate`)
            .then((res) => {
                console.log(res);
                setValidateMessage(res.data.message);
                if (res.data.addedBlock) {
                    setAddedBlock(res.data.addedBlock);
                }
            });
    };

    const handleGetChain = () => {
        axios.get(`${EXPRESS_API_URL}/chain`)
            .then((res) => {
                console.log(res);
                setChain(res.data);
            });
    };

    const renderObject = (obj) => {
        return (
            <pre className="rendered-object">
                {JSON.stringify(obj, null, 2)}
            </pre>
        );
    };

    return (
        <div className="test-container">
            <div className="test-form">
                <h2>Test Add</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>ID:</label>
                        <input
                            type="number"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="form-control"
                        />
                    </div>
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
                        <label>Chuyên ngành/Khoá học:</label>
                        <input
                            type="text"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Điểm:</label>
                        <input
                            type="number"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Người cấp:</label>
                        <input
                            type="text"
                            value={issuer}
                            onChange={(e) => setIssuer(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Ngày cấp:</label>
                        <input
                            type="date"
                            value={issuedDate}
                            onChange={(e) => setIssuedDate(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn-submit">Thêm</button>
                </form>
                <h3>{addMessage}</h3>
            </div>
            <div className="test-buttons">
                <button onClick={handleValidate} className="btn-action">Test Validate</button>
                <button onClick={handleGetChain} className="btn-action">Test Get Chain</button>
            </div>
            <div className="test-results">
                <h2>New Block:</h2>
                <h3>{validateMessage}</h3>
                {addedBlock ? (
                    renderObject(addedBlock)
                ) : (
                    <p>Added block will be shown here</p>
                )}
                <h2>Chain:</h2>
                {chain ? (
                    renderObject(chain)
                ) : (
                    <p>Blockchain will be shown here</p>
                )}
            </div>
        </div>
    );
};

export default Test;

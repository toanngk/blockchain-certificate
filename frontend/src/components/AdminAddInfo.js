import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/AdminAddInfo.css';

const EXPRESS_API_URL = 'http://localhost:8080';

const AddInfo = ({ userRole }) => {
    // State for adding grades
    const [studentId, setStudentId] = useState('');
    const [semesterId, setSemesterId] = useState('');
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [issuedDate, setIssuedDate] = useState('');
    const [addMessage, setAddMessage] = useState('');

    // State for adding students
    const [newStudentId, setNewStudentId] = useState('');
    const [newFullName, setNewFullName] = useState('');
    const [studentMessage, setStudentMessage] = useState('');

    // State for adding semesters
    const [newSemesterId, setNewSemesterId] = useState('');
    const [blockchainId, setBlockchainId] = useState('');
    const [semesterMessage, setSemesterMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            studentId: Number(studentId),
            subject: subject,
            grade: Number(grade),
            issuedDate: issuedDate
        };
        axios.post(`${EXPRESS_API_URL}/add`, data)
            .then((res) => {
                console.log(res);
                setAddMessage(res.data.message);
            });
    };

    const handleStudentSubmit = (e) => {
        e.preventDefault();
        const data = {
            studentId: Number(newStudentId),
            fullName: newFullName
        };
        axios.post(`${EXPRESS_API_URL}/addStudent`, data)
            .then((res) => {
                console.log(res);
                setStudentMessage(res.data.message);
            });
    };

    const handleSemesterSubmit = (e) => {
        e.preventDefault();
        const data = {
            semesterId: Number(newSemesterId)
        };
        axios.post(`${EXPRESS_API_URL}/addSemester`, data)
            .then((res) => {
                console.log(res);
                setSemesterMessage(res.data.message);
            });
    };

    if (userRole !== 'Admin') {
        // Redirect user if not an admin
        navigate('/'); // Redirect to home or another route
        return null; // Return null to prevent rendering anything
    }

    return (
        <div className="addInfo-container">
            {/* Form for adding grades */}
            <div className="addInfo-form">
                <h2>Thêm điểm cho sinh viên</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Mã ID Sinh viên:</label>
                        <input
                            type="number"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Mã học kì:</label>
                        <input
                            type="text"
                            value={semesterId}
                            onChange={(e) => setSemesterId(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Mã Môn học:</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Điểm trung bình:</label>
                        <input
                            type="number"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Ngày tạo:</label>
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

            {/* Form for adding students */}
            <div className="addInfo-form">
                <h2>Thêm sinh viên</h2>
                <form onSubmit={handleStudentSubmit}>
                    <div className="form-group">
                        <label>Mã ID:</label>
                        <input
                            type="number"
                            value={newStudentId}
                            onChange={(e) => setNewStudentId(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Họ tên:</label>
                        <input
                            type="text"
                            value={newFullName}
                            onChange={(e) => setNewFullName(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn-submit">Thêm</button>
                </form>
                <h3>{studentMessage}</h3>
            </div>

            {/* Form for adding semesters */}
            <div className="addInfo-form">
                <h2>Thêm học kì</h2>
                <form onSubmit={handleSemesterSubmit}>
                    <div className="form-group">
                        <label>Mã học kì:</label>
                        <input
                            type="number"
                            value={newSemesterId}
                            onChange={(e) => setNewSemesterId(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Mã ID Blockchain của học kì:</label>
                        <input
                            type="text"
                            value={blockchainId}
                            onChange={(e) => setBlockchainId(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn-submit">Thêm</button>
                </form>
                <h3>{semesterMessage}</h3>
            </div>
        </div>
    );
};

export default AddInfo;

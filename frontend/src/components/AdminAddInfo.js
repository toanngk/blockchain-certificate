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
    const [chain, setChain] = useState('');
    const [addedBlock, setAddedBlock] = useState('');
    const [addMessage, setAddMessage] = useState('');
    const [validateMessage, setValidateMessage] = useState('');

    // State for adding students
    const [newStudentId, setNewStudentId] = useState('');
    const [newFullName, setNewFullName] = useState('');
    const [studentMessage, setStudentMessage] = useState('');

    // State for handling semesters
    const [semesterMessage, setSemesterMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            studentId: Number(studentId),
            semesterId: Number(semesterId),
            subject: subject,
            grade: Number(grade),
            issuedDate: issuedDate
        };

        try {
            // Add student that anticiapte semester if not already added
            const response = await axios.post(`${EXPRESS_API_URL}/addStudentSemester`, { studentId: Number(studentId), semesterId: Number(semesterId) });
            if (response.data.message !== 'Student already in semester') {
                console.log(response.data.message);
            }

            // Then, add the grade
            const res = await axios.post(`${EXPRESS_API_URL}/add`, data);
            console.log(res);
            setAddMessage(res.data.message);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const handleValidate = () => {
        axios.get(`${EXPRESS_API_URL}/validate`)
            .then((res) => {
                console.log(res);
                setValidateMessage(res.data.message);
                if (res.data.addedBlock) {
                    setAddedBlock(res.data.addedBlock);
                    addSemester(); // Call addSemester after addedBlock is set
                }
            })
            .catch((err) => {
                console.error('Error validating data:', err);
                setValidateMessage('Error validating data');
            });
    };

    const addSemester = async () => {
        try {
            // Fetch last block hash
            const res = await axios.get(`${EXPRESS_API_URL}/getLastBlockHash`);
            const lastBlockHash = res.data.lastBlockHash;

            // Call backend to add semester with both SemesterID and BlockchainID
            const semesterData = {
                semesterId: Number(semesterId),
                currentHash: lastBlockHash
            };

            const addSemesterRes = await axios.post(`${EXPRESS_API_URL}/addSemester`, semesterData);
            console.log('Semester add response:', addSemesterRes);
            setSemesterMessage(addSemesterRes.data.message);
        } catch (error) {
            console.error('Error adding semester data:', error);
            setSemesterMessage('Error adding semester data');
        }
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
                // Optionally clear form inputs after successful submission
                setNewStudentId('');
                setNewFullName('');
            })
            .catch((err) => {
                console.error('Error adding student:', err);
                setStudentMessage('Error adding student');
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
                        <label>Mã Học kỳ:</label>
                        <input
                            type="number"
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
                    <button type="submit" className="btn-submit">Thêm Data</button>
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

            <div className="addInfo-form">
                <h2>Thêm dữ liệu vào Block</h2>
                <div className="test-buttons">
                    <button onClick={handleValidate} className="btn-action">Validate</button>
                    <button onClick={handleGetChain} className="btn-action">Get Chain</button>
                </div>

                <h2>New added Block</h2>
                <h3>{validateMessage}</h3>
                {addedBlock ? (
                    renderObject(addedBlock)
                ) : (
                    <p>Added block will be shown here</p>
                )}
                <h2>Blockchain</h2>
                {chain ? (
                    renderObject(chain)
                ) : (
                    <p>Blockchain will be shown here</p>
                )}
            </div>

        </div>
    );
};

export default AddInfo;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/ShowCertificate.css';
import { useNavigate } from 'react-router-dom';

const EXPRESS_API_URL = 'http://localhost:8080';

const ShowData = ({ userRole }) => {
    const [semesterData, setSemesterData] = useState([]);
    const [studentData, setStudentData] = useState([]);
    const [studentSemesterData, setStudentSemesterData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [chain, setChain] = useState(null); // State to hold blockchain data

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        fetchBlockchainData(); // Fetch blockchain data on component mount
    }, []);

    const fetchData = () => {
        axios.get(`${EXPRESS_API_URL}/showDB`)
            .then((res) => {
                console.log(res);
                const { semesters, students, studentSemesters, users } = res.data;

                setSemesterData(semesters);
                setStudentData(students);
                setStudentSemesterData(studentSemesters);
                setUserData(users);
            })
            .catch(error => {
                console.error('Fetch data error:', error);
            });
    };

    const fetchBlockchainData = () => {
        axios.get(`${EXPRESS_API_URL}/chain`)
            .then((res) => {
                console.log(res);
                setChain(res.data);
            })
            .catch((err) => {
                console.error('Error fetching blockchain data:', err);
            });
    };

    if (userRole !== 'Admin') {
        navigate('/'); // Redirect to home or another route if not an admin
        return null; // Return null to prevent rendering anything
    }

    const renderObject = (obj) => {
        return (
            <pre className="rendered-object">
                {JSON.stringify(obj, null, 2)}
            </pre>
        );
    };

    return (
        <div className="certificate-container">
            <h1>Dữ liệu Đại học</h1>
            <div className="test-buttons">
                <button onClick={fetchData}>Làm mới</button>
            </div>
            <div className="box-content">
                <h2>Học kỳ:</h2>
                {semesterData.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Blockchain ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {semesterData.map((semester) => (
                                <tr key={semester.SemesterID}>
                                    <td>{semester.SemesterID}</td>
                                    <td>{semester.BlockchainID}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data">No semesters found</p>
                )}
                <h2>Sinh viên:</h2>
                {studentData.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentData.map((student) => (
                                <tr key={student.StudentID}>
                                    <td>{student.StudentID}</td>
                                    <td>{student.FullName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data">No students found</p>
                )}
                <h2>Sinh viên tham gia học kỳ:</h2>
                {studentSemesterData.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Semester ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentSemesterData.map((studentSemester) => (
                                <tr key={`${studentSemester.StudentID}-${studentSemester.SemesterID}`}>
                                    <td>{studentSemester.StudentID}</td>
                                    <td>{studentSemester.SemesterID}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data">No student semesters found</p>
                )}
                <h2>Người dùng:</h2>
                {userData.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Full Name</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData.map((user) => (
                                <tr key={user.UserId}>
                                    <td>{user.Username}</td>
                                    <td>{user.FullName}</td>
                                    <td>{user.Role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data">No users found</p>
                )}
            </div>

            <h2>Blockchain</h2>
            {/* Display blockchain data */}
            <div className="blockchain-section">
                {chain ? (
                    renderObject(chain)
                ) : (
                    <p>Blockchain data will be shown here</p>
                )}
            </div>
        </div>
    );
};

export default ShowData;

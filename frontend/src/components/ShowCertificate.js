import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/ShowCertificate.css'; // Import the CSS file for styling

const EXPRESS_API_URL = 'http://localhost:8080';

const ShowData = ({ userRole }) => {
    const [semesterData, setSemesterData] = useState([]);
    const [studentData, setStudentData] = useState([]);
    const [studentSemesterData, setStudentSemesterData] = useState([]);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get(`${EXPRESS_API_URL}/showDB`)
            .then((res) => {
                console.log(res);
                const { semesters, students, studentSemesters, users } = res.data;

                // Assuming the response structure matches the expected structure from MySQL tables
                setSemesterData(semesters);
                setStudentData(students);
                setStudentSemesterData(studentSemesters);
                setUserData(users);
            })
            .catch(error => {
                console.error('Fetch data error:', error);
            });
    };

    return (
        <div className="certificate-container">
            <h1>University Database Details</h1>
            <div className="test-buttons">
                <button onClick={fetchData}>Refresh Data</button>
            </div>
            <div className="box-content">
                <h2>Semesters:</h2>
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
                <h2>Students:</h2>
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
                <h2>Student Semesters:</h2>
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
                <h2>Users:</h2>
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
        </div>
    );
}

export default ShowData;

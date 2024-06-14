import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Search from './components/Search';
import ShowCertificate from './components/ShowCertificate';
import AdminAddInfo from './components/AdminAddInfo';
import Test from './components/Test';
import './App.css';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');

    // Function to handle user login
    const handleLogin = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8888/signin', { username, password });
            const { user } = response.data;
            setLoggedIn(true);
            setUserRole(user.role);
        } catch (err) {
            console.error('Error signing in:', err);
        }
    };


    // Function to handle user logout
    const handleLogout = () => {
        setLoggedIn(false);
        setUserRole('');
        return <Navigate to="/signin" />;
    };

    return (
        <Router>
            <div className="Header">
                <nav className="nav-bar">
                    {!loggedIn && (
                        <>
                            <Link to="/signin" className="nav-link">Đăng Nhập</Link>
                            <Link to="/signup" className="nav-link">Đăng Ký</Link>
                        </>
                    )}
                    {loggedIn && userRole === 'Admin' && (
                        <>
                            <Link to="/search" className="nav-link">Tìm Kiếm</Link>
                            <Link to="/certificate" className="nav-link">Chứng Chỉ</Link>
                            <Link to="/admin" className="nav-link">Quản Trị</Link>
                            <Link to="/test" className="nav-link">Test</Link>
                            <button onClick={handleLogout} className="nav-link">Đăng Xuất</button>
                        </>
                    )}
                    {loggedIn && userRole === 'User' && (
                        <>
                            <Link to="/search" className="nav-link">Tìm Kiếm</Link>
                            <button onClick={handleLogout} className="nav-link">Đăng Xuất</button>
                        </>
                    )}
                </nav>
            </div>
            <div className="main-content">
                <Routes>
                    <Route path="/signin" element={<SignIn handleLogin={handleLogin} />} />
                    <Route path="/signup" element={<SignUp handleLogin={handleLogin} />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/certificate" element={<ShowCertificate />} />
                    <Route path="/admin" element={<AdminAddInfo userRole={userRole} />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/test" element={<Test userRole={userRole} />} />
                </Routes>
            </div>
        </Router>
    );
};

const Home = () => {
    return (
        <div className="Body">
            <header className="body-content">
                <h1>Welcome to the Blockchain Certificate App</h1>
                <p>Use the navigation links above to get started.</p>
            </header>
        </div>
    );
};

export default App;

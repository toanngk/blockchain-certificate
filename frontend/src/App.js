import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Search from './components/Search';
import ShowCertificate from './components/ShowCertificate';
import AdminAddInfo from './components/AdminAddInfo';
import Test from './components/Test';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <nav className="nav-bar">
                    <Link to="/signin" className="nav-link">Đăng Nhập</Link>
                    <Link to="/signup" className="nav-link">Đăng Ký</Link>
                    <Link to="/search" className="nav-link">Tìm Kiếm</Link>
                    <Link to="/certificate" className="nav-link">Chứng Chỉ</Link>
                    <Link to="/admin" className="nav-link">Quản Trị</Link>
                    <Link to="/test" className="nav-link">Test</Link>
                </nav>
                <Routes>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/certificate" element={<ShowCertificate />} />
                    <Route path="/admin" element={<AdminAddInfo />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/test" element={<Test />} />
                </Routes>
            </div>
        </Router>
    );
};

const Home = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to the Blockchain Certificate App</h1>
                <p>Use the navigation links above to get started.</p>
            </header>
        </div>
    );
};

export default App;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../contexts/UserContext';
import '../styles.css'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const InitialPage = () => {
    const navigate = useNavigate();

    const handleNavigateLoginPage = () => {
        navigate('/auth/login');
    }

    const handleNavigateSignUpPage = () => {
        navigate('/auth/signup');
    }

    return (
        <div className="home">
        <header className="login-header">
            <div className="navbar">
                <div className="navbar-left">
                    <h1>Study Match</h1>
                </div>
                <div className="navbar-right">
                    <button className="navbar-home-button" onClick={handleNavigateLoginPage}>Login</button>
                    <button className='navbar-groups-button' onClick={handleNavigateSignUpPage}>Sign Up</button>
                </div>
            </div>
            <h2>The study group that fits you.</h2>
        </header>

        <main className="home-main">
        </main>

        <Footer />
        </div>
    )
};

export default InitialPage;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../contexts/UserContext';
import '../styles.css'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeSlogan from "../components/HomeSlogan";
import Home from "./Home";
import NoBackgroundLogo from '/src/images/logo-no-background.png'

// Displayed before a user logs into their account or creates an account
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
        <header className="initial-page-header">
            <div className="navbar">
                <div className="navbar-left">
                    <div className="navbar-logo">
                        <img src={NoBackgroundLogo} width="85" height="50"/>
                    </div>
                    <h1>Study Match</h1>
                </div>
                <div className="navbar-right">
                    <button className="navbar-home-button" onClick={handleNavigateLoginPage}>Login</button>
                    <button className='navbar-groups-button' onClick={handleNavigateSignUpPage}>Sign Up</button>
                </div>
            </div>
        </header>

        <main className="home-main">
            <HomeSlogan />
        </main>

        <Footer />
        </div>
    )
};

export default InitialPage;
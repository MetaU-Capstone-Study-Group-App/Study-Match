import Navbar from './NavBar';
import { useUser } from "./contexts/UserContext";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProfilePage = () => {
    const {user, setUser} = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch("http://localhost:3000/auth/logout", {method: "POST", credentials: "include"});
        setUser(null); 
        navigate("/");
    };

    return (
        <div>
        <div className="profile-page">
        <header className="profile-page-header">
            <Navbar />
        </header>

        <main className="profile-page-main">
            <div>
                {user && user.username ? (
                    <>
                        <h1 className="page-header">Welcome, {user.username}!</h1>
                        <img src="src/images/profile-pic.png" alt="user.name"/>
                        <p>Name: {user.name}</p>
                        <p>Username: {user.username}</p>
                        <p>Current Study Groups:</p>
                        <button className="buttons" onClick={handleLogout}>Log Out</button>
                    </>
                ) : (
                    <>
                        <div>Please log in or sign up.</div>
                        <button type="submit" className="buttons" onClick={() => {navigate("/auth/login")}}>Log In</button>
                        <button type="submit" className="buttons" onClick={() => {navigate("/auth/signup")}}>Sign Up</button>
                    </>
                )}
            </div>
        </main>

        <footer className="footer">
            <p>© Study Match. All Rights Reserved.</p>
        </footer>
        </div>
        </div>
    )
}

export default ProfilePage;
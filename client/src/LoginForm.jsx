import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from './contexts/UserContext';
import './styles.css'
import Navbar from "./NavBar";

const LoginForm = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleLoginChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: "success", text: "Login successful!" });
                setUser(data); 
                navigate("/"); 
            } else {
                setMessage({ type: "error", text: data.error || "Login failed." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Network error. Please try again." });
        }
    };

    return (
        <div className="login">
            <div className="navbar">
                <div className="navbar-left">
                    <h1>Study Match</h1>
                </div>
            </div>
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit} className="login-form">
                <label className="login-labels">
                    Username:
                    <input
                        type="text"
                        className="login-username-input"
                        name="username"
                        value={formData.username}
                        onChange={handleLoginChange}
                        required
                    />
                </label>

                <label className="login-labels">
                    Password:
                    <input
                        type="password"
                        className="login-password-input"
                        name="password"
                        value={formData.password}
                        onChange={handleLoginChange}
                        required
                    />
                </label>

                <button type="submit" className="buttons">Log In</button>
                <label className="signup-label">
                    Don't have an account?
                    <button type="submit" className="buttons" onClick={() => {navigate("/auth/signup")}}>Sign Up</button>
                </label>

                {message && (
                    <p className={`message ${message.type}`}>{message.text}</p>
                )}
            </form>
            <footer className="footer">
                <p>© Study Match. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default LoginForm;
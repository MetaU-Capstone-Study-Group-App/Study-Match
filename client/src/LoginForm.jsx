import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from './contexts/UserContext';

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
        <form onSubmit={handleLoginSubmit} className="login-form">
            <label>
                Username:
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleLoginChange}
                    required
                />
            </label>

            <label>
                Password:
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleLoginChange}
                    required
                />
            </label>

            <button type="submit">Log In</button>

            {message && (
                <p className={`message ${message.type}`}>{message.text}</p>
            )}
        </form>
    );
};

export default LoginForm;